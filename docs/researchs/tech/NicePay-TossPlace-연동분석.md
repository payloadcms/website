# CareOn Payment Ingestion Layer: NicePay & Toss Place 연동 기술 심층 분석

NicePay와 Toss Place를 WSL 환경에서 통합하는 MVP 어댑터는 **현실적으로 구현 가능**하지만, 두 시스템의 연동 방식이 본질적으로 다르다. NicePay는 완전한 REST API를 제공하여 즉시 구현 가능한 반면, Toss Place는 Plugin SDK 기반으로 파트너십 프로그램 가입이 필수적이다. 본 보고서는 각 시스템의 기술 명세, 통합 스키마 설계, 그리고 즉시 실행 가능한 보일러플레이트 코드를 제공한다.

---

## 두 결제 시스템의 근본적 차이

NicePay와 Toss Place는 결제 데이터 접근 방식에서 완전히 다른 철학을 갖는다. **NicePay**는 전통적인 PG(Payment Gateway) 모델로, 가맹점이 서버에서 직접 REST API를 호출하여 결제를 요청하고 결과를 받는다. 반면 **Toss Place**는 POS 시스템 내장형 Plugin 아키텍처로, 외부 서버가 데이터를 "풀링"하는 것이 아니라 Plugin이 POS 내부에서 실행되며 데이터를 "푸시"하는 구조다.

| 구분 | NicePay | Toss Place |
|------|---------|------------|
| **시스템 유형** | 온라인 PG | 오프라인 POS Plugin |
| **통신 방식** | REST API (서버→PG) | Plugin SDK (POS 내부 실행) |
| **데이터 흐름** | Pull 방식 | Push 방식 |
| **개발 진입장벽** | 낮음 (즉시 시작) | 높음 (파트너십 필요) |
| **인증** | Basic Auth (clientId:secretKey) | OAuth 2.0 + 개발자 등록 |
| **테스트 환경** | 공개 Sandbox 제공 | 파트너 전용 |
| **Webhook** | 지원 (직접 설정) | Plugin에서 외부 HTTP 호출 |

---

## NicePay REST API 상세 명세

### 핵심 API 엔드포인트

NicePay는 **v1 REST API**를 표준으로 제공하며, Sandbox와 Production 환경이 분리되어 있다.

| 엔드포인트 | 메서드 | 용도 |
|-----------|--------|------|
| `/v1/payments/{tid}` | POST | 결제 승인 |
| `/v1/payments/{tid}` | GET | 거래 조회 (TID 기준) |
| `/v1/payments/find/{orderId}` | GET | 거래 조회 (주문번호 기준) |
| `/v1/payments/{tid}/cancel` | POST | 결제 취소/환불 |
| `/v1/subscribe/regist` | POST | 빌링키 발급 |
| `/v1/subscribe/{bid}/payments` | POST | 빌링 결제 승인 |
| `/v1/subscribe/{bid}/expire` | POST | 빌링키 삭제 |
| `/v1/receipt/` | POST | 현금영수증 발급 |
| `/v1/receipt/{tid}` | GET | 현금영수증 조회 |
| `/v1/receipt/{tid}/cancel` | POST | 현금영수증 취소 |

**API 도메인:**
- Sandbox: `https://sandbox-api.nicepay.co.kr`
- Production: `https://api.nicepay.co.kr`
- JS SDK: `https://pay.nicepay.co.kr/v1/js/`

### 인증 방식과 Sandbox 자격증명

NicePay는 **Basic Authentication**을 사용하며, 공개된 Sandbox 테스트 키를 제공한다:

```javascript
// Sandbox 테스트 키 (공개)
const NICEPAY_CLIENT_ID = 'S2_af4543a0be4d49a98122e01ec2059a56';
const NICEPAY_SECRET_KEY = '9eb85607103646da9f9c02b128f2e5ee';

// Authorization 헤더 생성
const credentials = Buffer.from(`${NICEPAY_CLIENT_ID}:${NICEPAY_SECRET_KEY}`).toString('base64');
const authHeader = `Basic ${credentials}`;
```

### 결제 승인 응답 구조

```json
{
  "resultCode": "0000",
  "resultMsg": "정상 처리되었습니다.",
  "tid": "UT0000113m01012111051714341073",
  "orderId": "c74a5960-830b-4cd8-82a9-fa1ce739a18f",
  "status": "paid",
  "paidAt": "2021-11-05T17:14:35.000+0900",
  "payMethod": "card",
  "amount": 1004,
  "balanceAmt": 1004,
  "goodsName": "상품명",
  "currency": "KRW",
  "approveNo": "000000",
  "signature": "63b251b31c909eebef1a9f4fcc19e77bdcb8f64fc1066a29670f8627186865cd",
  "card": {
    "cardCode": "04",
    "cardName": "삼성",
    "cardNum": "123412******1234",
    "cardQuota": 0,
    "cardType": "credit",
    "canPartCancel": true
  }
}
```

### Webhook 설정과 서명 검증

NicePay Webhook은 결제 승인, 가상계좌 입금, 취소 이벤트를 알려준다. **응답 형식이 중요하다**: HTTP 200 + "OK" 문자열 + `text/html` Content-Type.

**서명 검증 공식:**
```javascript
const signature = crypto
  .createHash('sha256')
  .update(`${tid}${amount}${ediDate}${secretKey}`)
  .digest('hex');
```

**Webhook 허용 IP (방화벽 설정용):**
- `121.133.126.86`
- `121.133.126.87`

---

## Toss Place Plugin SDK 아키텍처

### Plugin의 격리된 실행 환경

Toss Place Plugin SDK는 **VSCode Extension**과 유사한 아키텍처를 채택했다. Plugin 코드는 **Web Worker** 내에서 격리 실행되며, 메인 POS 앱과 메시지 패싱으로 통신한다. 이 설계로 Plugin 오류가 POS 전체를 마비시키는 것을 방지한다.

```
┌─────────────────────────────────────┐
│           Toss POS (Electron)        │
│  ┌─────────────────────────────────┐ │
│  │       Core POS Application      │ │
│  │   (주문, 결제, 테이블, 메뉴)      │ │
│  └──────────────┬──────────────────┘ │
│                 │ Message Bus        │
│  ┌──────────────┴──────────────────┐ │
│  │          Web Worker             │ │
│  │  ┌───────────────────────────┐  │ │
│  │  │   @toss-place/plugin-sdk  │  │ │
│  │  │   posPluginSdk 객체       │  │ │
│  │  └───────────────────────────┘  │ │
│  │  ┌───────────────────────────┐  │ │
│  │  │    Custom Plugin Code     │  │ │
│  │  └───────────────────────────┘  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### SDK 리소스와 외부 통신

```typescript
import { posPluginSdk } from "@tossplace/pos-plugin-sdk";

// 커스텀 결제 수단 등록
posPluginSdk.paymentMethod.add({
  data: {
    id: 'careon-payment',
    name: 'CareOn 결제',
    icon: 'https://example.com/icon.png',
  },
  payCallback: async (params) => {
    // 외부 서버로 결제 데이터 전송 (HTTP fetch 사용)
    const result = await fetch('https://YOUR_WEBHOOK_URL/toss-place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: params.amount,
        orderId: params.orderId,
        timestamp: new Date().toISOString()
      })
    });
    
    return {
      paymentKey: result.transactionId,
      approvedAt: result.approvedAt
    };
  },
  cancelCallback: async (params) => {
    // 취소 처리 로직
  }
});
```

**핵심 제약사항:** Toss Place Plugin 개발은 **B2B 파트너십 프로그램 가입이 필수**다. 일반 개발자가 npm 패키지만으로 연동할 수 없으며, https://tossplace.com/sector/plugin 에서 파트너 신청 후 개발자 센터 접근 권한을 받아야 한다.

---

## WSL 환경의 터널링 솔루션 비교

### 솔루션별 특성 매트릭스

| 항목 | ngrok | Cloudflare Tunnel | localtunnel | Tailscale Funnel |
|------|-------|-------------------|-------------|------------------|
| **무료 티어** | 제한적 | 무제한 | 완전 무료 | Tailscale 포함 |
| **월 가격** | $8-39+ | 무료 | 무료 | 무료 |
| **고정 URL** | 1개 무료 | 도메인 필요 | 불가 | MagicDNS |
| **대역폭** | 1GB/월 | 무제한 | 무제한 | 무제한 |
| **요청 제한** | 20,000/월 | 200 동시접속 | 없음 | 없음 |
| **설치 난이도** | 쉬움 | 중간 | 매우 쉬움 | 중간 |
| **WSL2 호환** | ✅ | ✅ | ✅ | ✅ |
| **웹 인스펙터** | ✅ | ❌ | ❌ | ❌ |

**추천:** 개발 단계에서는 **ngrok**(웹 인스펙터로 디버깅 용이), 지속적 개발환경에서는 **Cloudflare Tunnel**(무제한, 안정적)을 권장한다.

### WSL2 네트워크 설정

WSL2는 Hyper-V 경량 VM 위에서 실행되므로 Windows와 네트워크 스택이 분리된다. **localhost 포워딩**은 Windows Build 18945 이후 자동 지원되지만, LAN에서 접근하려면 추가 설정이 필요하다.

```powershell
# WSL2 IP 확인
$wslIP = (wsl hostname -I).Trim()

# 포트 포워딩 규칙 추가
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIP

# Windows 방화벽 규칙 추가
New-NetFireWallRule -DisplayName "WSL2 Port 3000" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000
```

---

## 통합 데이터 스키마 설계

### CareOn 통합 Transaction 스키마 (TypeScript)

NicePay와 Toss Place의 응답을 공통 형식으로 정규화하는 Adapter Pattern을 적용한다.

```typescript
// types/transaction.ts

/** 결제 상태 열거형 */
export type PaymentStatus =
  | 'READY'              // 결제 대기
  | 'IN_PROGRESS'        // 결제 진행중
  | 'WAITING_DEPOSIT'    // 입금 대기 (가상계좌)
  | 'PAID'               // 결제 완료
  | 'CANCELLED'          // 전액 취소
  | 'PARTIAL_CANCELLED'  // 부분 취소
  | 'FAILED'             // 실패
  | 'EXPIRED';           // 만료

/** 결제 수단 열거형 */
export type PaymentMethod =
  | 'CARD'
  | 'VIRTUAL_ACCOUNT'
  | 'TRANSFER'
  | 'MOBILE'
  | 'EASY_PAY'
  | 'CASH';

/** 데이터 출처 열거형 */
export type DataSource = 'NICEPAY' | 'TOSS_PLACE' | 'MANUAL';

/** 금액 정보 */
export interface IAmount {
  total: number;          // 총 결제금액
  taxFree: number;        // 면세 금액
  vat: number;            // 부가세
  supplyPrice: number;    // 공급가액
  currency: 'KRW' | 'USD';
}

/** 카드 결제 정보 */
export interface ICardInfo {
  issuerCode: string;           // 발급사 코드
  issuerName: string;           // 발급사명 (삼성, 현대 등)
  acquirerCode: string;         // 매입사 코드
  number: string;               // 마스킹된 카드번호
  cardType: 'CREDIT' | 'DEBIT' | 'PREPAID';
  ownerType: 'PERSONAL' | 'CORPORATE';
  approvalNumber: string;       // 승인번호
  installment: {
    months: number;             // 할부 개월 (0=일시불)
    isInterestFree: boolean;    // 무이자 여부
  };
}

/** 현금영수증 정보 */
export interface ICashReceipt {
  type: 'INCOME_DEDUCTION' | 'EXPENSE_PROOF';
  issueNumber: string;          // 국세청 발급번호
  requestedAt: string;          // ISO 8601
}

/** 정산 정보 */
export interface ISettlement {
  status: 'PENDING' | 'COMPLETED';
  salesDate?: string;           // 정산 매출일 (yyyy-MM-dd)
  payOutDate?: string;          // 정산 지급일
}

/** 메타데이터 */
export interface ITransactionMeta {
  source: DataSource;           // 데이터 출처
  rawPayload: Record<string, any>; // 원본 응답 보존
  receivedAt: string;           // 수신 시각
  webhookId?: string;           // 웹훅 고유 ID
}

/** CareOn 통합 트랜잭션 스키마 */
export interface ICareOnTransaction {
  // 고유 식별자
  id: string;                   // CareOn 내부 ID (UUID)
  paymentKey: string;           // PG 발급 결제키
  orderId: string;              // 가맹점 주문번호
  tid: string;                  // 거래 고유번호 (TID)

  // 금액 정보
  amount: IAmount;

  // 결제 상태
  status: PaymentStatus;
  
  // 결제 수단
  method: PaymentMethod;
  card?: ICardInfo;
  
  // 상품 정보
  goodsName: string;
  
  // 시각 정보
  requestedAt: string;          // 결제 요청 시각
  approvedAt?: string;          // 결제 승인 시각
  cancelledAt?: string;         // 취소 시각

  // 부가 정보
  cashReceipt?: ICashReceipt;
  settlement?: ISettlement;
  
  // 메타데이터
  meta: ITransactionMeta;
}

/** 한국 카드사 코드 매핑 */
export const KOREAN_CARD_CODES: Record<string, string> = {
  '01': 'BC카드',
  '02': 'KB국민카드',
  '03': '하나카드',
  '04': '삼성카드',
  '06': '신한카드',
  '07': '현대카드',
  '08': '롯데카드',
  '11': 'NH농협카드',
  '12': '수협카드',
};
```

---

## Adapter Pattern 구현

### NicePay Adapter

```typescript
// adapters/nicepay.adapter.ts
import crypto from 'crypto';
import { 
  ICareOnTransaction, 
  PaymentStatus, 
  KOREAN_CARD_CODES 
} from '../types/transaction';
import { v4 as uuidv4 } from 'uuid';

interface NicePayResponse {
  resultCode: string;
  resultMsg: string;
  tid: string;
  orderId: string;
  status: string;
  paidAt?: string;
  cancelledAt?: string;
  payMethod: string;
  amount: number;
  balanceAmt: number;
  goodsName: string;
  currency: string;
  approveNo?: string;
  signature: string;
  ediDate?: string;
  card?: {
    cardCode: string;
    cardName: string;
    cardNum: string;
    cardQuota: number;
    cardType: string;
    canPartCancel: boolean;
  };
}

export class NicePayAdapter {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  /** NicePay 응답을 CareOn 통합 스키마로 변환 */
  transform(response: NicePayResponse): ICareOnTransaction {
    const statusMap: Record<string, PaymentStatus> = {
      'ready': 'READY',
      'paid': 'PAID',
      'cancelled': 'CANCELLED',
      'partialCancelled': 'PARTIAL_CANCELLED',
      'failed': 'FAILED',
      'expired': 'EXPIRED',
    };

    const methodMap: Record<string, PaymentMethod> = {
      'card': 'CARD',
      'vbank': 'VIRTUAL_ACCOUNT',
      'bank': 'TRANSFER',
      'cellphone': 'MOBILE',
    };

    return {
      id: uuidv4(),
      paymentKey: response.tid,
      orderId: response.orderId,
      tid: response.tid,
      
      amount: {
        total: response.amount,
        taxFree: 0,  // NicePay 응답에서 추출 필요
        vat: Math.floor(response.amount / 11),
        supplyPrice: response.amount - Math.floor(response.amount / 11),
        currency: response.currency as 'KRW' | 'USD',
      },
      
      status: statusMap[response.status] || 'FAILED',
      method: methodMap[response.payMethod] || 'CARD',
      
      card: response.card ? {
        issuerCode: response.card.cardCode,
        issuerName: KOREAN_CARD_CODES[response.card.cardCode] || response.card.cardName,
        acquirerCode: response.card.cardCode,
        number: response.card.cardNum,
        cardType: response.card.cardType === 'credit' ? 'CREDIT' : 'DEBIT',
        ownerType: 'PERSONAL',
        approvalNumber: response.approveNo || '',
        installment: {
          months: response.card.cardQuota,
          isInterestFree: false,
        },
      } : undefined,
      
      goodsName: response.goodsName,
      requestedAt: new Date().toISOString(),
      approvedAt: response.paidAt,
      cancelledAt: response.cancelledAt,
      
      meta: {
        source: 'NICEPAY',
        rawPayload: response,
        receivedAt: new Date().toISOString(),
      },
    };
  }

  /** Webhook 서명 검증 */
  verifySignature(tid: string, amount: number, ediDate: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHash('sha256')
      .update(`${tid}${amount}${ediDate}${this.secretKey}`)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}
```

### Toss Place Adapter

```typescript
// adapters/toss.adapter.ts
import { ICareOnTransaction, PaymentStatus } from '../types/transaction';
import { v4 as uuidv4 } from 'uuid';

interface TossPlacePayload {
  orderId: string;
  amount: number;
  paymentKey: string;
  approvedAt: string;
  method?: string;
  status?: string;
  orderName?: string;
  // Toss Place Plugin에서 전송하는 추가 필드
  storeId?: string;
  tableNumber?: string;
  lineItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export class TossPlaceAdapter {
  /** Toss Place Plugin 데이터를 CareOn 통합 스키마로 변환 */
  transform(payload: TossPlacePayload): ICareOnTransaction {
    return {
      id: uuidv4(),
      paymentKey: payload.paymentKey,
      orderId: payload.orderId,
      tid: payload.paymentKey,  // Toss Place는 paymentKey가 TID 역할
      
      amount: {
        total: payload.amount,
        taxFree: 0,
        vat: Math.floor(payload.amount / 11),
        supplyPrice: payload.amount - Math.floor(payload.amount / 11),
        currency: 'KRW',
      },
      
      status: this.mapStatus(payload.status),
      method: 'CARD',  // Toss Place는 주로 카드 결제
      
      goodsName: payload.orderName || '토스플레이스 주문',
      requestedAt: new Date().toISOString(),
      approvedAt: payload.approvedAt,
      
      meta: {
        source: 'TOSS_PLACE',
        rawPayload: payload,
        receivedAt: new Date().toISOString(),
      },
    };
  }

  private mapStatus(status?: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'DONE': 'PAID',
      'CANCELED': 'CANCELLED',
      'WAITING_FOR_DEPOSIT': 'WAITING_DEPOSIT',
      'IN_PROGRESS': 'IN_PROGRESS',
    };
    return statusMap[status || ''] || 'PAID';
  }
}
```

---

## 완전한 보일러플레이트 코드

### 프로젝트 구조

```
careon-payment-ingestion/
├── package.json
├── .env.example
├── .gitignore
├── tsconfig.json
├── src/
│   ├── server.ts           # Express 메인 서버
│   ├── types/
│   │   └── transaction.ts  # 통합 스키마 타입
│   ├── adapters/
│   │   ├── nicepay.adapter.ts
│   │   └── toss.adapter.ts
│   ├── routes/
│   │   └── webhook.routes.ts
│   └── utils/
│       └── logger.ts
└── README.md
```

### package.json

```json
{
  "name": "careon-payment-ingestion",
  "version": "1.0.0",
  "description": "CareOn Payment Ingestion Layer - NicePay & Toss Place Integration",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "tunnel:ngrok": "ngrok http 3000",
    "tunnel:cf": "cloudflared tunnel --url http://localhost:3000"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/uuid": "^9.0.7",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.2"
  }
}
```

### .env.example

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# NicePay Sandbox Credentials (공개 테스트 키)
NICEPAY_CLIENT_ID=S2_af4543a0be4d49a98122e01ec2059a56
NICEPAY_SECRET_KEY=9eb85607103646da9f9c02b128f2e5ee
NICEPAY_API_URL=https://sandbox-api.nicepay.co.kr

# Toss Place Configuration (파트너십 가입 후 발급)
TOSS_PLACE_API_KEY=your_api_key_here
TOSS_PLACE_SECRET=your_secret_here

# Webhook Security
WEBHOOK_SECRET=your_webhook_secret_here

# Data Storage (향후 확장용)
DATABASE_URL=file:./dev.db
```

### src/server.ts (메인 서버)

```typescript
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 중복 방지용 처리된 웹훅 ID 저장
const processedWebhooks = new Map<string, number>();
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000;

// ========================================
// 미들웨어 설정
// ========================================

// Raw body 캡처 (서명 검증용) - JSON 파싱 전에 위치해야 함
app.use('/webhook', express.raw({ type: 'application/json', limit: '1mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========================================
// NicePay 설정
// ========================================
const NICEPAY_CONFIG = {
  clientId: process.env.NICEPAY_CLIENT_ID!,
  secretKey: process.env.NICEPAY_SECRET_KEY!,
  apiUrl: process.env.NICEPAY_API_URL || 'https://sandbox-api.nicepay.co.kr',
};

function getNicePayAuthHeader(): string {
  const credentials = Buffer.from(
    `${NICEPAY_CONFIG.clientId}:${NICEPAY_CONFIG.secretKey}`
  ).toString('base64');
  return `Basic ${credentials}`;
}

function verifyNicePaySignature(tid: string, amount: number, ediDate: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHash('sha256')
    .update(`${tid}${amount}${ediDate}${NICEPAY_CONFIG.secretKey}`)
    .digest('hex');
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  } catch {
    return false;
  }
}

// ========================================
// 통합 트랜잭션 저장소 (메모리 - 추후 DB 교체)
// ========================================
interface CareOnTransaction {
  id: string;
  source: 'NICEPAY' | 'TOSS_PLACE';
  paymentKey: string;
  orderId: string;
  amount: number;
  status: string;
  method: string;
  approvedAt?: string;
  rawPayload: any;
  receivedAt: string;
}

const transactionStore: CareOnTransaction[] = [];

// ========================================
// 라우트: 헬스체크
// ========================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    transactions: transactionStore.length,
  });
});

// ========================================
// 라우트: NicePay Webhook
// ========================================
app.post('/webhook/nicepay', (req: Request, res: Response) => {
  try {
    // Raw body를 JSON으로 파싱
    const payload = JSON.parse(req.body.toString());
    
    console.log('[NicePay Webhook] Received:', JSON.stringify(payload, null, 2));
    
    const { tid, orderId, amount, status, ediDate, signature, paidAt, payMethod, goodsName } = payload;
    
    // 서명 검증
    if (signature && !verifyNicePaySignature(tid, amount, ediDate, signature)) {
      console.error('[NicePay Webhook] Signature verification failed');
      return res.status(401).send('Invalid signature');
    }
    
    // 중복 체크
    if (processedWebhooks.has(tid)) {
      console.log('[NicePay Webhook] Duplicate ignored:', tid);
      return res.type('text/html').send('OK');
    }
    
    // 통합 스키마로 변환 및 저장
    const transaction: CareOnTransaction = {
      id: uuidv4(),
      source: 'NICEPAY',
      paymentKey: tid,
      orderId: orderId,
      amount: amount,
      status: status,
      method: payMethod || 'card',
      approvedAt: paidAt,
      rawPayload: payload,
      receivedAt: new Date().toISOString(),
    };
    
    transactionStore.push(transaction);
    processedWebhooks.set(tid, Date.now());
    
    console.log('[NicePay Webhook] Transaction saved:', transaction.id);
    
    // NicePay 요구사항: "OK" 문자열 + text/html
    res.type('text/html').send('OK');
    
  } catch (error) {
    console.error('[NicePay Webhook] Error:', error);
    res.status(500).send('Error');
  }
});

// ========================================
// 라우트: Toss Place Webhook
// ========================================
app.post('/webhook/toss-place', (req: Request, res: Response) => {
  try {
    const payload = JSON.parse(req.body.toString());
    
    console.log('[Toss Place Webhook] Received:', JSON.stringify(payload, null, 2));
    
    const { paymentKey, orderId, amount, approvedAt, orderName } = payload;
    
    // 중복 체크
    const webhookId = paymentKey || crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    if (processedWebhooks.has(webhookId)) {
      console.log('[Toss Place Webhook] Duplicate ignored:', webhookId);
      return res.json({ status: 'already_processed' });
    }
    
    // 통합 스키마로 변환 및 저장
    const transaction: CareOnTransaction = {
      id: uuidv4(),
      source: 'TOSS_PLACE',
      paymentKey: paymentKey,
      orderId: orderId,
      amount: amount,
      status: 'PAID',
      method: 'CARD',
      approvedAt: approvedAt,
      rawPayload: payload,
      receivedAt: new Date().toISOString(),
    };
    
    transactionStore.push(transaction);
    processedWebhooks.set(webhookId, Date.now());
    
    console.log('[Toss Place Webhook] Transaction saved:', transaction.id);
    
    res.json({ received: true, id: transaction.id });
    
  } catch (error) {
    console.error('[Toss Place Webhook] Error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// ========================================
// 라우트: 트랜잭션 조회 API
// ========================================
app.get('/api/transactions', (req, res) => {
  const { source, limit = 100 } = req.query;
  
  let results = [...transactionStore];
  
  if (source) {
    results = results.filter(t => t.source === source);
  }
  
  results = results.slice(-Number(limit)).reverse();
  
  res.json({
    total: results.length,
    transactions: results,
  });
});

app.get('/api/transactions/:id', (req, res) => {
  const transaction = transactionStore.find(t => t.id === req.params.id);
  
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  res.json(transaction);
});

// ========================================
// 라우트: NicePay 결제 승인 (returnUrl 콜백)
// ========================================
app.post('/payments/nicepay/approve', async (req: Request, res: Response) => {
  const { tid, amount, orderId, authResultCode, signature } = req.body;
  
  if (authResultCode !== '0000') {
    return res.status(400).json({ error: 'Authentication failed', code: authResultCode });
  }
  
  try {
    // NicePay 승인 API 호출
    const axios = require('axios');
    const response = await axios.post(
      `${NICEPAY_CONFIG.apiUrl}/v1/payments/${tid}`,
      { amount: parseInt(amount) },
      {
        headers: {
          'Authorization': getNicePayAuthHeader(),
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data.resultCode === '0000') {
      // 트랜잭션 저장
      const transaction: CareOnTransaction = {
        id: uuidv4(),
        source: 'NICEPAY',
        paymentKey: tid,
        orderId: orderId,
        amount: parseInt(amount),
        status: response.data.status,
        method: response.data.payMethod,
        approvedAt: response.data.paidAt,
        rawPayload: response.data,
        receivedAt: new Date().toISOString(),
      };
      
      transactionStore.push(transaction);
      
      res.json({ success: true, transaction });
    } else {
      res.status(400).json({ error: response.data.resultMsg });
    }
  } catch (error: any) {
    console.error('[NicePay Approve] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// 에러 핸들러
// ========================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ========================================
// 서버 시작
// ========================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     CareOn Payment Ingestion Layer                        ║
║     Server running on http://localhost:${PORT}              ║
╠═══════════════════════════════════════════════════════════╣
║  Endpoints:                                               ║
║    GET  /health              - Health check               ║
║    POST /webhook/nicepay     - NicePay webhook receiver   ║
║    POST /webhook/toss-place  - Toss Place webhook         ║
║    POST /payments/nicepay/approve - Payment approval      ║
║    GET  /api/transactions    - List transactions          ║
║    GET  /api/transactions/:id - Get transaction           ║
╠═══════════════════════════════════════════════════════════╣
║  Next Steps:                                              ║
║    1. Run: npm run tunnel:ngrok                           ║
║    2. Register webhook URL in NicePay admin panel         ║
║    3. Test with curl (see README)                         ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### .gitignore

```
node_modules/
dist/
.env
*.log
.DS_Store
```

---

## Setup Manual: npm install부터 첫 Webhook 수신까지

### Step 1: 프로젝트 생성 및 의존성 설치

```bash
# WSL2 터미널에서 실행
cd ~
mkdir careon-payment-ingestion && cd careon-payment-ingestion

# package.json 생성 (위 내용 복사)
npm init -y

# 의존성 설치
npm install express axios dotenv uuid
npm install -D typescript ts-node-dev @types/express @types/node @types/uuid
```

### Step 2: 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 기본 Sandbox 키는 이미 설정되어 있음
cat .env
```

### Step 3: 서버 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 출력 확인:
# CareOn Payment Ingestion Layer
# Server running on http://localhost:3000
```

### Step 4: ngrok 터널링 설정

```bash
# 새 터미널에서
# ngrok 설치 (아직 안 했다면)
curl -fsSL -o ngrok.tar.gz https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
sudo tar -zxvf ngrok.tar.gz -C /usr/local/bin

# ngrok 인증 (https://dashboard.ngrok.com에서 토큰 발급)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# 터널 시작
ngrok http 3000

# 출력된 URL 복사 (예: https://abc123.ngrok-free.app)
```

### Step 5: 로컬 테스트

```bash
# 헬스체크
curl http://localhost:3000/health

# NicePay Webhook 시뮬레이션
curl -X POST http://localhost:3000/webhook/nicepay \
  -H "Content-Type: application/json" \
  -d '{
    "resultCode": "0000",
    "tid": "TEST123456789",
    "orderId": "order-001",
    "amount": 10000,
    "status": "paid",
    "payMethod": "card",
    "paidAt": "2025-11-29T10:00:00+09:00",
    "ediDate": "2025-11-29T10:00:00+09:00",
    "signature": "test"
  }'

# Toss Place Webhook 시뮬레이션
curl -X POST http://localhost:3000/webhook/toss-place \
  -H "Content-Type: application/json" \
  -d '{
    "paymentKey": "TOSS_PAY_KEY_001",
    "orderId": "toss-order-001",
    "amount": 15000,
    "approvedAt": "2025-11-29T11:00:00+09:00",
    "orderName": "아메리카노 2잔"
  }'

# 저장된 트랜잭션 조회
curl http://localhost:3000/api/transactions
```

### Step 6: NicePay 관리자 패널에서 Webhook 등록

1. https://start.nicepay.co.kr 로그인
2. 개발정보 → 웹훅 설정
3. Webhook URL: `https://YOUR-NGROK-URL.ngrok-free.app/webhook/nicepay`
4. 이벤트 선택: 결제 승인, 가상계좌 입금, 결제 취소
5. 저장

---

## 트러블슈팅 가이드

| 문제 | 원인 | 해결 방법 |
|------|------|----------|
| `EADDRINUSE: port 3000` | 포트 이미 사용 중 | `lsof -i :3000` 후 프로세스 종료, 또는 PORT 환경변수 변경 |
| NicePay Webhook 401 | 서명 불일치 | Secret Key 확인, 서명 생성 순서 확인 (tid+amount+ediDate+secretKey) |
| ngrok 연결 끊김 | 무료 플랜 세션 제한 | 새 터널 시작, 또는 Cloudflare Tunnel 사용 |
| WSL에서 localhost 접근 불가 | WSL2 네트워크 문제 | `wsl --shutdown` 후 재시작, 또는 mirrored 네트워킹 모드 설정 |
| Toss Place SDK 접근 불가 | 파트너십 미가입 | https://tossplace.com/sector/plugin 에서 파트너 신청 |
| Webhook 중복 수신 | 재시도 로직 | 이미 구현된 idempotency 체크 확인 (processedWebhooks Map) |

---

## 구현 난이도와 예상 소요 시간

| 연동 대상 | 난이도 | 예상 시간 | 현실성 평가 |
|-----------|--------|----------|-------------|
| **NicePay 기본 연동** | ⭐⭐ 낮음 | 1-2일 | ✅ 즉시 가능. 공개 Sandbox, REST API, 명확한 문서 |
| **NicePay Webhook** | ⭐⭐ 낮음 | 0.5일 | ✅ 즉시 가능. 서명 검증만 구현하면 됨 |
| **NicePay 빌링(정기결제)** | ⭐⭐⭐ 중간 | 2-3일 | ✅ 가능. 카드 암호화(AES) 구현 필요 |
| **Toss Place Plugin** | ⭐⭐⭐⭐⭐ 높음 | 2-4주+ | ⚠️ **파트너십 필수**. SDK 접근 권한 필요 |
| **통합 스키마 설계** | ⭐⭐⭐ 중간 | 1-2일 | ✅ 이미 본 문서에 기본 설계 제공 |
| **WSL 터널링** | ⭐⭐ 낮음 | 0.5일 | ✅ ngrok 즉시 사용 가능 |

### 잠재적 장애물과 우회 방법

**NicePay 관련:**
- **Production 키 발급 지연**: VAN 대리점 통해 신청 시 1-2주 소요 → Sandbox에서 충분히 개발 후 신청
- **가상계좌 테스트 제한**: 실제 입금 테스트 불가 → 운영팀에 테스트 계정 요청

**Toss Place 관련:**
- **파트너십 승인 대기**: 수 주 소요 가능 → 대안으로 Toss Payments(온라인 PG) API 먼저 연동
- **Plugin SDK 문서 부족**: 공개 문서 제한적 → Toss Makers 컨퍼런스 영상/자료 참고

**일반:**
- **ngrok 무료 제한**: 1GB/월 대역폭 → Cloudflare Tunnel(무료, 무제한)로 전환
- **WSL IP 변경**: 재부팅 시 IP 변경 → mirrored 네트워킹 모드 또는 자동화 스크립트

---

## 결론

본 분석을 통해 CareOn Payment Ingestion Layer의 MVP 구현 경로가 명확해졌다. **NicePay 연동은 즉시 개발 가능**하며, 제공된 보일러플레이트 코드로 1-2일 내 Webhook 수신 및 통합 스키마 변환 기능을 갖출 수 있다. 반면 **Toss Place는 파트너십 프로그램 가입이 선행 조건**이므로, B2B 파트너 신청(https://tossplace.com/sector/plugin)을 병행하면서 NicePay 연동을 먼저 완성하는 것이 효율적이다.

핵심 다음 단계는 다음과 같다: (1) 제공된 코드를 WSL에 배포하고 ngrok으로 Webhook 수신 테스트, (2) NicePay Sandbox에서 실제 결제 승인/취소 플로우 검증, (3) Toss Place 파트너십 신청 후 SDK 접근 권한 확보, (4) 두 시스템의 데이터가 통합 스키마로 정규화되어 저장되는지 확인.
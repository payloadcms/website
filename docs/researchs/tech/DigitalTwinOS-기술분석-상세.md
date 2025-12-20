# 케어온 Digital Twin OS: 소상공인 매장의 AI 운영 체제 구축 기술 분석

**Toss Place Plugin SDK와 NVIDIA Jetson 기반으로 카페/식당 매장의 디지털 트윈 운영 체제를 현실적으로 구현할 수 있다.** 팔란티어 Ontology 개념을 소규모 매장에 적용하려면 복잡한 메타데이터 플랫폼이 아닌 PostgreSQL/SQLite 기반의 Object-Link-Action 패턴으로 단순화해야 하며, 한국 시장의 핵심 제약(VAN 결제, 폐쇄적 POS 생태계)은 Toss Place의 개방형 Plugin SDK를 통해 해결 가능하다. 총 하드웨어 비용 약 **200-300만원**, 개발 기간 **8-12주**로 1인 개발팀도 구현 가능한 현실적 아키텍처를 제안한다.

---

## 1. 팔란티어 Ontology의 소상공인 적용 방법론

### Object-Link-Action 패턴의 본질

팔란티어 Foundry의 Ontology는 데이터 카탈로그가 아닌 **"운영 레이어"**다. 핵심 차별점은 **Action**이라는 개념으로, AI가 분석에 그치지 않고 실제 외부 시스템(POS, 재고 관리, IoT 장비)에 변경을 가할 수 있다는 점이다. 세 가지 구성 요소는 다음과 같다:

| 구성 요소 | 정의 | 카페/식당 예시 |
|-----------|------|---------------|
| **Object** | 실세계 엔티티의 스키마 정의 | 고객, 주문, 상품, 재고, 직원, 장비, 존(Zone) |
| **Link** | Object 간 관계 정의 | 고객→주문(placed), 주문→상품(contains), 상품→재고(requires) |
| **Action** | 상태 변경을 일으키는 작업 정의 | 주문생성, 재고차감, 장비점검알림, 자동발주 |

**핵심 발견**: Apache Atlas, LinkedIn DataHub, Amundsen 등 오픈소스 메타데이터 플랫폼은 **데이터 검색/거버넌스**용이지 Ontology의 Action 패러다임을 구현하지 않는다. 이들은 8GB+ RAM을 요구하여 엣지 디바이스에 부적합하다.

### 1인 개발팀을 위한 최소 Ontology 구현

복잡한 그래프 데이터베이스(Neo4j) 대신 **SQLite + JSON** 패턴으로 80%의 기능을 구현할 수 있다:

```sql
-- 중앙 Objects 테이블
CREATE TABLE objects (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,  -- 'customer', 'order', 'product'
  name TEXT NOT NULL,
  attributes JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Links 테이블 (관계 정의)
CREATE TABLE links (
  source_id TEXT REFERENCES objects(id),
  target_id TEXT REFERENCES objects(id),
  link_type TEXT NOT NULL,  -- 'placed', 'contains', 'requires'
  properties JSON,
  UNIQUE(source_id, target_id, link_type)
);

-- Actions 로그 테이블
CREATE TABLE actions_log (
  id INTEGER PRIMARY KEY,
  action_type TEXT NOT NULL,
  entity_id TEXT,
  parameters JSON,
  result JSON,
  performed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 카페/식당 데이터 객체 모델 예시

| Object 타입 | 주요 속성 | Link 관계 |
|-------------|-----------|-----------|
| **Customer** | id, name, phone, loyalty_points, preferences(JSON) | →Order(placed), →Zone(visited) |
| **Order** | id, status, total, payment_method, created_at | →Product(contains), →Staff(handled_by), →Zone(served_at) |
| **Product** | id, name, category, price, allergens, is_available | →Inventory(requires), →Equipment(prepared_with) |
| **Inventory** | id, name, quantity, unit, reorder_point | →Supplier(supplied_by) |
| **Staff** | id, name, role, hourly_rate, shift_schedule | →Zone(assigned_to), →Order(handled) |
| **Equipment** | id, name, status, last_maintenance, sensor_ids | →Zone(located_in), →Product(used_for) |
| **Zone** | id, name, type(dining/kitchen/counter), capacity | ←Staff(assigned), ←Equipment(located) |

### 자동화 Action 정의

| Action | 트리거 | 효과 | 자동화 수준 |
|--------|--------|------|------------|
| **Place_Order** | POS 체크아웃 | Order 생성, Inventory 차감, 주방 알림 | HIGH - POS Plugin |
| **Auto_Reorder** | 재고 임계치 도달 | 발주서 생성, 관리자 알림 | HIGH - 규칙 기반 |
| **Update_Availability** | 재료 소진 | 메뉴 품절 처리 | HIGH - 자동 |
| **Schedule_Maintenance** | 시간/사용량 기반 | 점검 태스크 생성 | MEDIUM - IoT 연동 |
| **Adjust_Staffing** | 트래픽 예측 | 시프트 조정 제안 | MEDIUM - AI 보조 |

---

## 2. 엣지 디바이스 기반 CCTV 객체 인식 시스템

### 하드웨어 비교 및 추천

| 디바이스 | 가격(USD) | AI 성능 | 전력 | YOLOv8n FPS | 추천도 |
|---------|----------|--------|-----|-------------|--------|
| **NVIDIA Jetson Orin Nano Super** | **$249** | 67 TOPS | 7-25W | **40-50** | ⭐⭐⭐⭐⭐ |
| Raspberry Pi 5 + Hailo-8L AI Kit | ~$150 | 13 TOPS | ~5W | 25-30 | ⭐⭐⭐⭐ |
| Intel NUC (Core Ultra 2) | $400-800 | 99 TOPS | 35-65W | 30-60 | ⭐⭐⭐ |
| Google Coral Dev Board | $149-170 | 4 TOPS | 2W | ~30 | ⛔ EOL |

**핵심 권장**: **NVIDIA Jetson Orin Nano Super ($249)**. 2024년 가격이 $499에서 $249로 인하되었으며, Ampere GPU(1024 CUDA 코어), 8GB LPDDR5, TensorRT 최적화를 제공한다. 카페 환경에서 **4대 카메라 동시 처리**(5-10 FPS)가 가능하다.

**주의**: Google Coral은 2021년 이후 업데이트가 중단되어 Python 3.10+ 호환성 문제가 있다. 새 프로젝트에는 **Hailo AI Kit**을 권장한다.

### 객체 인식 모델 선택

| 모델 | mAP@50 | 파라미터 | Jetson 추론 시간 | 권장 용도 |
|------|--------|---------|-----------------|----------|
| **YOLOv8n** | 37.3% | 3.2M | ~23ms (INT8) | ⭐ 범용 추천 |
| YOLOv11n | ~39% | 2.6M | ~13.5ms | 최신, 빠름 |
| YOLO-NAS-S | 47.5% | 12.2M | ~35ms | 정확도 우선 |
| MobileNet SSD v2 | 22% | 4.4M | ~6ms (TPU) | 최대 속도 |

**매장 환경 최적 구성**: YOLOv8n + **ByteTrack** 트래커 조합. Ultralytics 라이브러리가 `model.track(source, tracker="bytetrack.yaml")`로 통합 API를 제공한다. INT8 양자화로 모델 크기 75% 감소, 정확도 손실 1-2% mAP 수준.

### RTSP 스트림 처리 파이프라인

**GStreamer 파이프라인 (Jetson 하드웨어 디코딩)**:
```python
import cv2

rtsp_url = "rtsp://admin:password@192.168.1.64:554/Streaming/Channels/101"

gst_pipeline = (
    f'rtspsrc location={rtsp_url} latency=300 ! '
    'rtph264depay ! h264parse ! nvv4l2decoder ! '
    'nvvidconv ! video/x-raw,format=BGRx ! '
    'videoconvert ! video/x-raw,format=BGR ! '
    'appsink drop=1 sync=false'
)
cap = cv2.VideoCapture(gst_pipeline, cv2.CAP_GSTREAMER)
```

**프레임 샘플링 전략**: 카페/식당에서 방문객 카운팅, 체류 시간 측정에는 **1-5 FPS**로 충분하다. 실시간 30fps는 동선 추적이 필요한 경우에만 사용한다.

### 메타데이터 추출 및 저장

| 메트릭 | 데이터 타입 | 갱신 주기 | 일일 저장량 |
|--------|-----------|----------|-----------|
| 방문객 수 (in/out) | Integer | 이벤트 발생 시 | ~10KB |
| 존별 점유율 | Integer/zone | 초당 | ~500KB |
| 체류 시간 | Float (초) | 퇴장 시 | ~50KB |
| 히트맵 | 좌표 배열 | 방문자당 | ~200KB |
| 피크 시간 패턴 | 집계값 | 시간당 | ~5KB |

**추천 저장소**: SQLite(7일 로컬 보관) + 15분 주기 클라우드 동기화. 한 매장 기준 월 **~1GB** 이벤트 데이터.

---

## 3. IoT 및 출입통제 시스템 통합

### IoT 프로토콜 한국 시장 분석

| 프로토콜 | 주파수 | 허브 필요 | 한국 기기 가용성 | 권장도 |
|---------|-------|---------|----------------|-------|
| **Zigbee 3.0** | 2.4 GHz | Yes | ⭐⭐⭐⭐⭐ 최고 | ⭐ 주력 |
| Matter | Multiple | Yes | ⭐⭐⭐⭐ 성장 중 | 미래 대비 |
| Z-Wave | 921.42 MHz(한국) | Yes | ⭐⭐⭐ 제한적 | 비추천 |
| Wi-Fi Direct | 2.4/5 GHz | No | ⭐⭐⭐⭐⭐ | 전력 소모 高 |

**추천**: **Zigbee 3.0**을 주력으로, Matter는 신규 기기용으로 병행 채택. Samsung SmartThings 생태계와의 호환성, 쿠팡/네이버쇼핑에서의 풍부한 기기 선택지가 장점이다. 2024년 기준 Matter 1.4까지 출시되었으며 삼성/LG가 적극 지원 중이나, 아직 "Stage 2" 단계로 완전한 호환성은 미완성.

### 한국 출입통제 시스템 비교

| 브랜드 | API 접근 | 인증 방식 | 로그 추출 | 가격대 | 추천 용도 |
|--------|---------|----------|----------|-------|----------|
| **Suprema** | ⭐⭐⭐⭐⭐ REST API 완비 | 얼굴/지문/NFC/QR | ⭐⭐⭐⭐⭐ | ₩50-300만 | **API 연동 필수 시** |
| Samsung SDS/직방 | ⭐⭐⭐ 제한적 | 지문/NFC/BT | ⭐⭐⭐ 앱 기반 | ₩20-60만 | 예산 제한 시 |
| 게이트맨 | ⭐⭐ 앱 전용 | 지문/NFC/PIN | ⭐⭐⭐ 앱 기반 | ₩20-50만 | 소비자용 |
| 유니온커뮤니티 | ⭐⭐⭐⭐ SDK 제공 | 얼굴/지문/홍채 | ⭐⭐⭐⭐ | ₩30-100만+ | 엔터프라이즈 |

**핵심 추천**: 프로그래매틱 제어가 필요하면 **Suprema**. BioStar 2 REST API로 사용자/장치/출입 기록 완전 제어 가능. CLUe 플랫폼은 클라우드 기반으로 온프레미스 서버 불필요. 예산이 제한적이면 Samsung SDS/직방 제품을 SmartThings Zigbee 연동으로 사용.

### 전력/환경 센서 한국 구매 가이드

| 제품 | 프로토콜 | 최대 부하 | 전력 모니터링 | 가격(원) | 구매처 |
|------|---------|---------|-------------|---------|--------|
| **IKEA INSPELNING** | Zigbee 3.0 | 16A/3680W | ✅ | ~12,900 | IKEA Korea |
| Tuya Zigbee 20A | Zigbee 3.0 | 20A | ✅ | ~15,000-25,000 | AliExpress |
| 다원DNS Zigbee | Zigbee | 16A | ✅ | ~25,000-35,000 | 국내 유통 |
| Aqara 온습도 센서 | Zigbee | - | - | ~15,000-25,000 | 쿠팡 |

**최적 조합**: IKEA INSPELNING 스마트 플러그(가성비 최고), Aqara 온습도/모션 센서, SONOFF ZBDongle-P(Zigbee 코디네이터).

### 통합 허브 구성

**Raspberry Pi 5 + Home Assistant OS**를 권장한다. 2024년 2월 HAOS 12부터 Pi 5 공식 지원, NVMe SSD로 안정성 확보. Jetson Nano에서도 Docker 컨테이너로 구동 가능하나 공식 지원은 아님.

**Home Assistant 상업용 배포 고려사항**:
- 2023년 Cure53 보안 감사 완료 (중요 이슈 모두 해결)
- 2FA 필수 활성화, HTTPS/TLS 적용
- 네트워크 분리 (VLAN으로 IoT 기기 격리)
- Nabu Casa 클라우드로 안전한 원격 접속

**예상 IoT 하드웨어 비용**:

| 항목 | 제품 | 예상 가격(원) |
|------|------|-------------|
| 허브 | Raspberry Pi 5 8GB + 케이스 + 27W PSU | 150,000 |
| 스토리지 | NVMe SSD 256GB + HAT | 80,000 |
| Zigbee 코디네이터 | SONOFF ZBDongle-P | 25,000 |
| 스마트 플러그 5개 | IKEA INSPELNING | 65,000 |
| 온습도 센서 3개 | Aqara Zigbee | 60,000 |
| 모션 센서 2개 | Aqara P1 | 60,000 |
| 도어 센서 2개 | Aqara Door/Window | 30,000 |
| 출입통제 | Suprema 엔트리급 | 500,000-800,000 |
| **합계** | | **~1,000,000-1,300,000** |

---

## 4. 나이스(NICE) VAN 결제 데이터 연동

### API 현황과 접근 방법

**공식 API 존재**: https://developers.nicepay.co.kr/ 에서 개발자 포털 운영 중.

| API 카테고리 | 기능 | 비고 |
|-------------|------|------|
| 결제/발행 | 결제창, 빌링, 현금영수증 | PG 통합용 |
| 조회 API | 거래 조회, 약관, 카드 이벤트 | 가맹점별 조회 |
| 정산/대사 | 거래·정산·대사 | 정산 데이터 |
| 취소/환불 | 취소·환불·망취소 | 거래 관리 |
| Webhooks | 실시간 알림 | 이벤트 기반 |

**핵심 제약**: 나이스페이먼츠 API는 **PG(Payment Gateway) 통합**용으로, 신규 결제 처리가 주 목적이다. VAN 대리점 수준에서 전체 가맹점 데이터 조회는 별도 협의가 필요하다.

### VAN 대리점 데이터 접근 현실

| 접근 레벨 | 데이터 범위 | 접근 방법 |
|----------|-----------|----------|
| 가맹점 | 자기 거래만 | NIBS 포털 |
| **대리점 (케어온)** | 관리 가맹점 포트폴리오 | 대리점 관리 시스템 |
| VAN사 | 전체 | 내부 시스템 |

**NIBS 업무통합시스템** (newnibs.nicevan.co.kr): 웹 기반 접근, 휴대폰 본인인증 필요, Excel/CSV 내보내기 지원, 실시간 거래 모니터링.

### 데이터 연동 옵션 우선순위

| 순위 | 방법 | 실현 가능성 | 소요 시간 | 비고 |
|------|------|-----------|----------|------|
| 1 | **NICE PG API (가맹점별)** | HIGH | 2-4주 | 가맹점별 clientId/secretKey 필요 |
| 2 | **NIBS 포털 내보내기** | MEDIUM | 1-2주 | 수동/반자동, Excel 내보내기 |
| 3 | 3자 집계 서비스 API | MEDIUM | 2-4주 | 더체크(thecheck.co.kr) 등 |
| 4 | RPA/스크래핑 | LOW-MEDIUM | 4-8주 | 법적 검토 필요, 유지보수 부담 |
| 5 | 마이데이터 사업자 라이선스 | LOW | 6-12개월 | 규제 승인 필요 |

**추천 경로**: 
1. 즉시: NIBS 포털 Excel 내보내기 활용 (수동/반자동)
2. 단기: 나이스 영업팀에 **대리점 전용 API** 접근 문의
3. 중기: PortOne(구 아임포트) 등 통합 결제 플랫폼 검토
4. 장기: 마이데이터 2.0 동향 모니터링

### 거래 데이터 스키마

```typescript
interface KoreanPaymentTransaction {
  tid: string;           // 거래키
  orderId: string;       // 주문번호
  approveNo: string;     // 승인번호
  paidAt: string;        // 결제시간 (ISO 8601)
  amount: number;        // 결제금액
  payMethod: 'card' | 'vbank' | 'trans' | 'phone';
  card: {
    cardCode: string;    // 카드사 코드
    cardName: string;    // 카드사명
    cardNum: string;     // 마스킹 카드번호
    cardQuota: number;   // 할부개월 (0=일시불)
    cardType: 'credit' | 'debit';
  };
  status: 'ready' | 'paid' | 'cancelled' | 'failed';
}
```

---

## 5. POS/키오스크 시장 분석: Toss Place Plugin SDK가 핵심

### 한국 POS 시장 현황 (2024-2025)

| 제공업체 | 시장 위치 | 가격 모델 | API 개방성 | 권장도 |
|---------|----------|----------|-----------|-------|
| **토스 Place** | 급성장 | 단말기 ₩0(프로모션), SW ₩0 | ⭐⭐⭐⭐⭐ Plugin SDK | ⭐⭐⭐⭐⭐ |
| OKPOS | 외식업 1위 (~40%) | 월 ₩36,000-44,000 | ⭐⭐ 파트너십 전용 | ⭐⭐⭐ |
| 페이히어 | 8만+ 가맹점 | SW 무료, HW 별도 | ⭐⭐ 제한적 | ⭐⭐⭐ |
| 키움페이 | VAN+POS 통합 | VAN 서비스 연계 | ⭐⭐⭐ 개발자 센터 | ⭐⭐⭐ |
| POSBANK | 하드웨어 1위 | OEM/ODM | ⭐ 소프트웨어 파트너 통해 | ⭐⭐ |

### Toss Place Plugin SDK - 결정적 발견

**공식 문서**: https://docs.tossplace.com/

Toss Place가 **Plugin SDK**를 통해 외부 개발자의 확장 기능 개발을 허용한다는 것이 이번 조사의 핵심 발견이다. 이는 디지털 트윈 시스템 구축에 가장 이상적인 통합 경로다.

**Plugin으로 접근 가능한 데이터**:
- ✅ 거래 데이터: 실시간 접근
- ✅ 주문 관리: 완전한 CRUD 작업
- ✅ 테이블 관리: 접근 가능
- ✅ 결제 수단: 제어 가능
- ✅ 고객 데이터: 적절한 권한으로 접근

**Plugin 개발 프로세스**:
1. Toss Place 개발자 센터 등록
2. Plugin SDK로 개발
3. 내부 검토용 플러그인 업로드
4. 가맹점 POS 기기에 배포
5. (예정) 앱스토어 형태 배포 계획

### 국제 POS의 한국 진출 현황

| 시스템 | 한국 시장 상태 | API 품질 | 디지털 트윈 가능성 |
|--------|--------------|---------|------------------|
| Square | ⛔ 미진출 | ⭐⭐⭐⭐⭐ | N/A |
| Toast | ⛔ 미진출 | ⭐⭐⭐⭐⭐ | N/A |
| Lightspeed | ⛔ 미진출 | ⭐⭐⭐⭐ | N/A |
| Clover | ⛔ 미진출 | ⭐⭐⭐⭐ | N/A |

**결론**: Square, Toast 등 API 친화적인 해외 POS는 VAN/결제 인프라 차이로 **한국에서 운영 불가**. 오픈소스 POS(Odoo, UniCenta)도 VAN 연동의 복잡성으로 현실적이지 않다.

### 한국 POS 연동의 구조적 장벽

| 장벽 | 설명 | 복잡도 | 우회 방법 |
|------|------|-------|---------|
| VAN 연동 | 모든 카드 결제는 등록된 VAN 통과 필수 | HIGH | VAN사와 계약 |
| 세금계산서 | 전자세금계산서 국세청 제출 의무 | MEDIUM | Bolta API 등 활용 |
| 카드 단말기 규정 | 여신협회 기술 표준 충족 필수 | HIGH | 인증 하드웨어 사용 |
| VCAT 모듈 | VAN 통신용 필수 소프트웨어 모듈 | HIGH | VAN사 제공 |

---

## 6. 데이터 아키텍처 및 스키마 설계

### 1인 개발자를 위한 기술 스택

| 레이어 | 기술 | 선택 이유 |
|--------|------|----------|
| **백엔드** | Python (FastAPI) | 생태계 최대, 빠른 개발 |
| **데이터베이스** | SQLite + DuckDB | Zero-ops, Pi에서 검증됨 |
| **메시징** | Mosquitto MQTT | 업계 표준, 경량 |
| **프론트엔드** | React + Tremor | 대시보드 특화, 낮은 유지보수 |
| **데이터 수집** | MQTT 직접 구독 | 단순 Python/Node MQTT 클라이언트 |

### 메시지 브로커 비교

| 브로커 | 메모리 | Pi 5/Jetson 적합성 | 학습 곡선 | 권장도 |
|--------|--------|-------------------|----------|-------|
| **Mosquitto MQTT** | 2-5MB | ⭐⭐⭐⭐⭐ 최고 | 낮음 | ⭐⭐⭐⭐⭐ |
| NATS Core | 10-20MB | 양호 | 중간 | ⭐⭐⭐ |
| Redis Streams | 30-100MB+ | 무거움 | 중간 | ⭐⭐ |
| Kafka | 1GB+ | ⛔ 부적합 | 높음 | ⛔ |

**최선의 선택**: Mosquitto MQTT. `apt install mosquitto`로 설치, 모든 IoT 기기/센서가 MQTT 지원, Node-RED/InfluxDB/Grafana와 즉시 통합.

### 데이터베이스 전략

학술 연구(Raspberry Pi 벤치마크)에 따르면:

| DB | 단일 Insert/sec | 배치 Insert(10) | 분석 쿼리 |
|----|----------------|-----------------|----------|
| SQLite | 8 | 54 | 양호 |
| PostgreSQL | 260 | 1,753 | 매우 좋음 |
| TimescaleDB | 230 | 1,185 | 시계열 최고 |
| InfluxDB | 54 | 467 | 시계열 양호 |

**추천 하이브리드 구조**:
```
SQLite (주 저장소)
├── 운영 데이터 (OLTP): 주문, 고객, 상품, 재고
├── 이벤트 로그 (Event Sourcing)
└── 센서 리딩 (시계열)
         │
         │ 주기적 집계
         ▼
DuckDB (분석용)
├── 복잡한 분석 쿼리
├── 대시보드 집계
└── SQLite 직접 연결 가능
```

**SQLite 최적화 설정**:
```sql
PRAGMA journal_mode = WAL;   -- 동시 읽기/쓰기
PRAGMA synchronous = NORMAL; -- 내구성/속도 균형
PRAGMA cache_size = -8000;   -- 8MB 캐시
```

### 완전한 데이터 스키마 예시

```sql
-- 고객
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  loyalty_points INTEGER DEFAULT 0,
  preferences JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 상품
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  cost REAL,
  attributes JSON,  -- {"allergens": [], "prep_time_minutes": 5}
  active INTEGER DEFAULT 1
);

-- 주문
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id),
  order_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  order_type TEXT,  -- dine-in, takeaway, delivery
  zone_id TEXT,
  total REAL,
  payment_method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- 주문 항목
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  modifications JSON
);

-- 재고
CREATE TABLE inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current_quantity REAL,
  unit TEXT,
  min_threshold REAL,
  last_restocked DATETIME
);

-- 센서 리딩 (시계열)
CREATE TABLE sensor_readings (
  id INTEGER PRIMARY KEY,
  timestamp INTEGER NOT NULL,  -- Unix timestamp
  sensor_id TEXT NOT NULL,
  sensor_type TEXT NOT NULL,
  value REAL NOT NULL
);
CREATE INDEX idx_sensor_time ON sensor_readings(sensor_id, timestamp DESC);

-- 이벤트 로그
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  actor_id TEXT,
  payload JSON NOT NULL
);
```

### 대시보드 및 시각화

| 옵션 | 메모리 | SQLite 지원 | 권장도 |
|------|--------|------------|-------|
| Grafana | 200-400MB | 플러그인 통해 | ⭐⭐⭐ |
| Metabase | 500MB+ | 직접 지원 | ⭐⭐ |
| **React + Tremor** | ~50MB | API 통해 | ⭐⭐⭐⭐⭐ |

**소규모 팀 최적**: React + Tremor. 대시보드 특화 35+ 컴포넌트, Tailwind CSS 기반, **프론트엔드 개발자 1명이 며칠 내 완전한 대시보드 구축 가능**.

```jsx
import { Card, AreaChart, Metric, Title } from "@tremor/react";

function SalesDashboard({ data }) {
  return (
    <Card>
      <Title>오늘의 매출</Title>
      <Metric>₩1,245,000</Metric>
      <AreaChart
        data={data}
        index="hour"
        categories={["revenue", "orders"]}
        colors={["emerald", "blue"]}
      />
    </Card>
  );
}
```

---

## 7. 전체 시스템 아키텍처

### 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         클라우드 서비스 (선택)                                │
│   Home Assistant Cloud (원격 접속) │ 백업 스토리지 │ 분석 대시보드            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ 15분 주기 동기화
                    ┌──────────────────┴──────────────────┐
                    │                                      │
┌───────────────────┴───────────────────┐  ┌──────────────┴──────────────────┐
│        NVIDIA Jetson Orin Nano        │  │      Raspberry Pi 5 + HAT       │
│         (영상 분석 전용)               │  │    (IoT 허브 + 데이터 통합)      │
│                                        │  │                                  │
│  ┌──────────┐  ┌──────────────────┐   │  │  ┌────────────────────────────┐ │
│  │ CCTV x4  │→│ GStreamer Decoder│   │  │  │     Home Assistant OS      │ │
│  │ (RTSP)   │  └────────┬─────────┘   │  │  │  - Zigbee2MQTT (센서)      │ │
│  └──────────┘           │             │  │  │  - MQTT Broker (Mosquitto) │ │
│                ┌────────┴─────────┐   │  │  │  - Node-RED (자동화)       │ │
│                │ YOLOv8n TensorRT │   │  │  └────────────┬───────────────┘ │
│                │ + ByteTrack      │   │  │               │                 │
│                └────────┬─────────┘   │  │  ┌────────────┴───────────────┐ │
│                         │             │  │  │     Python FastAPI         │ │
│                ┌────────┴─────────┐   │  │  │  - REST API                │ │
│                │ 메타데이터 추출   │   │  │  │  - MQTT 구독               │ │
│                │ - 방문객 수      │   │  │  │  - Toss Place Plugin 연동  │ │
│                │ - 체류 시간      │   │  │  │  - 이벤트 처리             │ │
│                │ - 히트맵        │   │  │  └────────────┬───────────────┘ │
│                └────────┬─────────┘   │  │               │                 │
│                         │ MQTT        │  │  ┌────────────┴───────────────┐ │
└─────────────────────────┼─────────────┘  │  │  SQLite (WAL) + DuckDB     │ │
                          │                │  │  - 주문, 고객, 재고         │ │
                          └────────────────┼─▶│  - 센서 데이터              │ │
                                           │  │  - 이벤트 로그              │ │
┌──────────────────────────────────────────┤  └────────────────────────────┘ │
│           외부 시스템 연동               │                                  │
├──────────────────────────────────────────┤  ┌────────────────────────────┐ │
│  ┌─────────────┐  ┌─────────────────┐   │  │  React + Tremor Dashboard  │ │
│  │Toss Place   │  │ NICE VAN       │   │  │  - 실시간 KPI              │ │
│  │Plugin SDK   │  │ API/NIBS       │   │  │  - 매출 분석               │ │
│  │- 주문 데이터 │  │- 결제 데이터   │   │  │  - 트래픽 히트맵           │ │
│  │- 재고 연동  │  │- 정산 데이터   │   │  │  - 재고 알림               │ │
│  └─────────────┘  └─────────────────┘   │  └────────────────────────────┘ │
└──────────────────────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           IoT 디바이스 레이어                                │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│   Zigbee 센서   │   출입통제      │   스마트 플러그  │    환경 센서          │
│  - 모션 감지    │  - Suprema API  │  - IKEA 플러그  │  - 온습도 (Aqara)    │
│  - 도어/창문   │  - NFC/지문     │  - 전력 모니터링│  - 조도 센서         │
│  - Zigbee 3.0  │  - 출입 로그    │  - 16A/3680W   │  - 공기질 (선택)     │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

### 전체 비용 추정

| 카테고리 | 항목 | 비용(원) |
|---------|------|---------|
| **영상 분석** | Jetson Orin Nano Super + PSU + 케이스 | ~400,000 |
| | CCTV 4대 (저가형) | ~300,000-600,000 |
| **IoT 허브** | Raspberry Pi 5 8GB + NVMe + Zigbee | ~255,000 |
| **IoT 기기** | 플러그, 센서, 도어락 | ~650,000-1,100,000 |
| **합계** | | **~1,600,000 - 2,400,000** |

### 개발 일정 추정 (1 백엔드 + 1 프론트엔드)

| 주차 | 백엔드 | 프론트엔드 |
|------|--------|-----------|
| 1-2 | DB 스키마, 기본 CRUD API | 대시보드 레이아웃, 컴포넌트 |
| 3-4 | MQTT 통합, 센서 데이터 수집 | 실시간 차트, KPI 위젯 |
| 5-6 | Toss Place Plugin 개발 | 주문/재고 화면 |
| 7-8 | 이벤트 로그, 분석 쿼리 | 히트맵, 알림 시스템 |
| 9-10 | CCTV 연동, 영상 분석 파이프라인 | 영상 분석 뷰, 통합 테스트 |
| 11-12 | 통합 테스트, 배포, 최적화 | UX 개선, 문서화 |

---

## 결론: 실행 가능한 Digital Twin 구축 로드맵

팔란티어 Ontology의 핵심 가치인 **"AI가 분석을 넘어 실제 행동(Action)을 취할 수 있는 운영 체제"**를 소상공인 매장에 적용하는 것은 기술적으로 실현 가능하다. 핵심은 복잡성을 피하고 검증된 경량 기술 스택을 선택하는 것이다.

**즉시 실행 항목**:
- Toss Place 개발자 센터 등록 및 Plugin SDK 접근 확보
- NVIDIA Jetson Orin Nano Super 구매 (가격 인하로 $249)
- NICE 영업팀에 대리점 전용 API 접근 문의

**3개월 내 달성 가능한 MVP**:
- 실시간 방문객 카운팅 및 체류 시간 분석
- POS 연동을 통한 주문-재고 자동 관리
- IoT 기반 전력/환경 모니터링
- 통합 대시보드

**피해야 할 것**:
- ❌ Kafka, Redis Cluster 등 과도한 인프라
- ❌ Neo4j 등 그래프 데이터베이스 (SQLite로 충분)
- ❌ 마이크로서비스 아키텍처
- ❌ Kubernetes/Docker Swarm

이 아키텍처는 **$50 Raspberry Pi에서 구동**되면서도 하루 수천 건의 거래와 수백만 개의 센서 리딩을 처리할 수 있다. 소상공인 매장의 "손발 달린 디지털 트윈"이라는 비전은 올바른 기술 선택과 집중된 개발로 현실이 될 수 있다.
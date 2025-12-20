# 네이버 블로그 자동 포스팅 시스템 개발을 위한 딥 리서치 지시 프롬프트

## 🎯 프로젝트 목표
안드로이드 디바이스에서 **네이버 블로그 자동 포스팅**을 구현하되, **이미지 삽입**과 **이미지에 URL 링크 추가** 기능을 포함한 완전 자동화 시스템을 개발해야 합니다.

## 📋 요구사항 명세
1. **핵심 기능**: 네이버 블로그 앱을 통한 자동 포스팅
2. **이미지 처리**: 로컬/웹 이미지 업로드 및 삽입
3. **링크 기능**: 삽입된 이미지에 URL 하이퍼링크 부착
4. **실행 환경**: Android 디바이스 + Droidrun 프레임워크
5. **출력 형태**: 완전 자동화된 포스팅 완료

## 🔧 Droidrun 프레임워크 분석 결과

### 아키텍처 이해
```
DroidAgent (오케스트레이터)
├── 추론 모드: ManagerAgent → ExecutorAgent → ScripterAgent
└── 직접 모드: CodeActAgent
```

### 핵심 컴포넌트
- **Portal APK**: 접근성 서비스를 통한 UI 트리 노출
- **다중 에이전트**: 계획(Manager) → 실행(Executor) → 스크립팅(Scripter)
- **이벤트 스트리밍**: 실시간 실행 모니터링
- **커스텀 도구**: 확장 가능한 기능 추가

### 사용 가능한 도구
```python
# UI 상호작용
tap_by_index(index), swipe(), input_text(), back()

# 앱 관리
start_app(package), get_state(), take_screenshot()

# 데이터 처리
remember(), get_memory(), complete()

# 커스텀 도구 확장 가능
custom_tools = {"api_call": api_function}
```

## 🔍 딥 리서치 요구사항

### 1. 네이버 블로그 앱 분석
**필수 조사사항:**
- 네이버 블로그 앱의 UI 구조 및 컴포넌트 계층도
- 글쓰기 화면의 정확한 요소 식별자 및 좌표
- 이미지 업로드 프로세스 및 버튼 위치
- 링크 추가 인터페이스 및 동작 방식
- 포스팅 완료까지의 전체 워크플로우

**조사 방법:**
- 실제 앱 설치 및 UI 트리 덤프
- 다양한 화면 크기에서의 일관성 검증
- 동적 콘텐츠 로딩 대응 전략

### 2. 이미지 처리 메커니즘
**기술적 도전과제:**
- 안드로이드 파일 시스템 접근 및 이미지 저장
- 네이버 블로그의 이미지 업로드 API 이해
- 이미지 압축 및 포맷 변환 요구사항
- 다중 이미지 순차 처리 로직

**구현 전략:**
- 로컬 파일 시스템 vs 웹 URL 이미지 구분 처리
- 이미지 유효성 검증 및 오류 처리
- 업로드 진행상황 모니터링

### 3. URL 링크 부착 시스템
**핵심 요구사항:**
- 이미지 선택 및 링크 추가 UI 조작
- URL 유효성 검증 및 포맷팅
- 링크 텍스트 커스터마이징
- 다중 링크 지원

### 4. 자동화 워크플로우 설계
**단계별 프로세스:**
```
1. 네이버 블로그 앱 실행 및 로그인
2. 새 글쓰기 시작
3. 제목 및 본문 입력
4. 이미지 파일 준비 및 업로드
5. 각 이미지에 URL 링크 부착
6. 포스팅 완료 및 검증
```

### 5. 오류 처리 및 복구 전략
**예상되는 문제점:**
- 네트워크 타임아웃 및 재시도 로직
- 앱 업데이트로 인한 UI 변경 대응
- 로그인 세션 만료 처리
- 이미지 업로드 실패 시 롤백

## 🛠️ 구현 전략 제안

### 권장 아키텍처
```python
# 1. 추론 모드 사용 (복잡한 워크플로우)
config.agent.reasoning = True

# 2. 네이버 블로그 앱 카드 생성
app_cards = {
  "com.nhn.android.blog": "naver_blog.md"
}

# 3. 커스텀 도구로 이미지 처리
custom_tools = {
  "prepare_images": prepare_images_function,
  "add_image_links": add_image_links_function,
  "validate_posting": validate_posting_function
}
```

### 커스텀 도구 설계
```python
def prepare_images(image_paths: List[str]) -> Dict:
    """이미지 파일들을 안드로이드 파일 시스템으로 복사"""
    pass

def add_image_links(image_indices: List[int], urls: List[str]) -> bool:
    """각 이미지에 URL 링크 부착"""
    pass

def validate_posting(post_url: str) -> bool:
    """포스팅 성공 검증"""
    pass
```

## 📊 평가 기준 및 성공 메트릭

### 기능 완성도
- [ ] 네이버 블로그 앱 자동 실행 및 로그인
- [ ] 텍스트 포스팅 자동화
- [ ] 단일/다중 이미지 업로드
- [ ] 이미지별 URL 링크 부착
- [ ] 포스팅 완료 및 URL 반환

### 안정성 지표
- [ ] 90% 이상의 성공률
- [ ] 평균 실행 시간 5분 이내
- [ ] 오류 발생 시 적절한 복구

### 확장성
- [ ] 다양한 이미지 포맷 지원
- [ ] 커스텀 링크 텍스트 지원
- [ ] 배치 처리 기능

## 🎯 구체적인 조사 및 구현 지시사항

### Phase 1: 네이버 블로그 앱 리버스 엔지니어링
1. **UI 요소 매핑**: 모든 글쓰기 관련 화면의 요소 계층도 작성
2. **워크플로우 시퀀스**: 포스팅 완료까지의 클릭/입력 시퀀스 기록
3. **동적 요소 처리**: 로딩 상태, 팝업, 에러 화면 대응 전략

### Phase 2: 이미지 처리 파이프라인
1. **파일 시스템 통합**: Android 파일 접근 권한 및 경로 최적화
2. **업로드 메커니즘**: 네이버의 이미지 업로드 API 분석
3. **링크 부착 로직**: 이미지 선택 → 링크 추가 → URL 입력 자동화

### Phase 3: Droidrun 통합 및 최적화
1. **에이전트 구성**: Manager/Executor/Scripter 역할 분담 최적화
2. **커스텀 도구 개발**: 이미지 처리 및 API 호출 도구 구현
3. **에러 처리 강화**: 네트워크 문제, UI 변경, 세션 만료 대응

### Phase 4: 테스트 및 배포
1. **종단간 테스트**: 실제 포스팅 시나리오 검증
2. **성능 최적화**: 실행 시간 단축 및 리소스 사용 최적화
3. **모니터링**: 실행 로그 및 성공률 추적 시스템

## 🚀 기대 결과물

### 코드 구조
```
naver_blog_automation/
├── config/
│   ├── config.yaml          # Droidrun 구성
│   └── app_cards/
│       └── naver_blog.md    # 앱 카드
├── tools/
│   ├── image_processor.py   # 이미지 처리 도구
│   ├── naver_api.py        # 네이버 API 연동
│   └── link_manager.py     # 링크 관리 도구
├── workflows/
│   ├── posting_workflow.py # 메인 워크플로우
│   └── error_recovery.py   # 오류 복구
└── tests/
    ├── integration_test.py # 통합 테스트
    └── ui_mapping.py       # UI 매핑 검증
```

### 실행 예시
```python
from naver_blog_automation import NaverBlogPoster

poster = NaverBlogPoster(
    title="자동 포스팅 테스트",
    content="Droidrun으로 생성된 포스트입니다.",
    images=[
        {"path": "/path/to/image1.jpg", "url": "https://example.com/1"},
        {"path": "/path/to/image2.png", "url": "https://example.com/2"}
    ]
)

result = await poster.post()
print(f"포스팅 완료: {result.post_url}")
```

## 🔍 추가 조사 필요사항

### 네이버 블로그 앱 버전 호환성
- 최신 버전 vs 구 버전 UI 차이 분석
- 업데이트 대응 전략 수립

### 네트워크 및 API 제한
- 업로드 크기 제한 및 압축 전략
- API 호출 빈도 제한 및 분산 처리

### 보안 및 개인정보
- 로그인 정보 안전한 저장 및 사용
- 세션 관리 및 자동 재인증

이 프롬프트를 기반으로 상세한 기술 분석과 구현 계획을 수립해주시기 바랍니다. 특히 네이버 블로그 앱의 실제 UI 구조와 Droidrun 프레임워크의 최적 활용 방안에 중점을 두어 조사해주세요.

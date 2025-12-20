---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-app.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
1. 환경설정
	AndroidManifast.xml 파일에 3rd 어플리케이션 호출을 위한 패키지명 정의, 권한 및 네트워크 보안 예외 설정을 합니다.
	```java
	<?xml version="1.0" encoding="utf-8"?>
	<manifest xmlns:android="http://schemas.android.com/apk/res/android"
	    package="kr.co.nicepay.nicepayappsample">
	    <queries>
	        <!--신용카드-->
	        <package android:name="kr.co.samsungcard.mpocket" />  <!--삼성 앱카드, 삼성 앱카드 공동인증서-->
	        <package android:name="com.shcard.smartpay" />  <!--신한 페이판-->
	        <package android:name="com.shinhancard.smartshinhan" />  <!--신한(ARS/일반결제/Smart결제), 신한 공동인증서-->
	        <package android:name="com.kbcard.cxh.appcard" />  <!--KBPay-->
	        <package android:name="com.kbstar.liivbank" />  <!--LiiV(국민은행)-->
	        <package android:name="com.kbstar.reboot" />  <!--new liib-->
	        <package android:name="kvp.jjy.MispAndroid320" />  <!--페이북/ISP-->
	        <package android:name="com.hanaskcard.paycla" />  <!--하나카드 원큐페이-->
	        <package android:name="kr.co.hanamembers.hmscustomer" />  <!--하나멤버스-->
	        <package android:name="com.lcacApp" />  <!--롯데 앱카드-->
	        <package android:name="nh.smart.nhallonepay" />  <!--NH 올원페이, NH 올원페이 공동인증서-->
	        <package android:name="com.wooricard.smartapp" />  <!--우리 WON 카드-->
	        <package android:name="com.wooribank.smart.npib" />  <!--우리 WON 뱅킹-->
	        <package android:name="com.hyundaicard.appcard" />  <!--현대 앱카드-->
	        <package android:name="kr.co.citibank.citimobile" />  <!--씨티카드-->
	        <package android:name="com.shinhan.smartcaremgr" />  <!--신한슈퍼SOL-->
	        <package android:name="net.ib.android.smcard" />  <!--삼성 monimo-->
	        <package android:name="com.kakaobank.channel" />  <!--카카오뱅크 앱카드-->
	        <!--공인인증-->
	        <package android:name="com.hanaskcard.rocomo.potal" />  <!--하나카드-->
	        <package android:name="com.lumensoft.touchenappfree" />  <!--공동인증서-->
	        <!--백신-->
	        <package android:name="com.TouchEn.mVaccine.webs" />  <!--TouchEn mVaccine(신한)-->
	        <package android:name="com.ahnlab.v3mobileplus" />  <!--V3(NH, 현대)-->
	        <package android:name="kr.co.shiftworks.vguardweb" />  <!--V-Guard(삼성)-->
	        <!--간편결제-->
	        <package android:name="com.samsung.android.spay" />  <!--삼성페이(삼성, 농협, KB)-->
	        <package android:name="com.samsung.android.spaylite" />  <!--삼성페이 미니(삼성, KB)-->
	        <package android:name="com.kakao.talk" />  <!--카카오페이-->
	        <package android:name="com.nhn.android.search" />  <!--네이버페이-->
	        <package android:name="com.ssg.serviceapp.android.egiftcertificate" />  <!--SSGPay(현대)-->
	        <package android:name="com.nhnent.payapp" />  <!--페이코(삼성, 농협, KB)-->
	        <package android:name="com.lge.lgpay" />  <!--엘지페이(삼성, KB)-->
	        <package android:name="com.lottemembers.android" />  <!--LPay-->
	        <package android:name="com.tencent.mm" /> <!-- 위챗페이-->
	        <package android:name="viva.republica.toss" /> <!-- 토스-->
	        <!--계좌이체-->
	        <package android:name="com.kftc.bankpay.android" />  <!--금결원-->
	        <package android:name="com.kbankwith.smartbank" />  <!--케이뱅크-->
	        <!--본인인증-->
	        <package android:name="com.sktelecom.tauth" />  <!--SKT-->
	        <package android:name="com.kt.ktauth" />  <!--KT-->
	        <package android:name="com.lguplus.smartotp" />  <!--LGT-->
	    </queries>
	    <uses-permission android:name="android.permission.INTERNET" />
	    <application
	        android:allowBackup="true"
	        android:icon="@mipmap/ic_launcher"
	        android:label="@string/app_name"
	        android:roundIcon="@mipmap/ic_launcher_round"
	        android:supportsRtl="true"
	        android:theme="@style/AppTheme"
	        android:usesCleartextTraffic="true">
	        <activity android:name=".MainActivity">
	            <intent-filter>
	                <action android:name="android.intent.action.MAIN" />
	                <category android:name="android.intent.category.LAUNCHER" />
	            </intent-filter>
	        </activity>
	        <activity
	            android:name=".WebViewActivity"
	            android:label="NicePay Smart"
	            android:configChanges="orientation"
	            android:screenOrientation="portrait">
	            <intent-filter>
	                <action android:name="android.intent.action.VIEW" />
	            </intent-filter>
	        </activity>
	    </application>
	</manifest>
	```
2. 웹뷰 연동
	웹뷰에서 자바스크립트 실행 가능하도록 설정 (WebViewActivity.kt)
	```java
	class WebViewActivity : AppCompatActivity() {
	    companion object {
	        const val MERCHANT_URL = "https://web.nicepay.co.kr/demo/v3/mobileReq.jsp"
	    }
	    override fun onCreate(savedInstanceState: Bundle?) {
	        super.onCreate(savedInstanceState)
	        setContentView(R.layout.activity_webview)
	        webview.webViewClient = WebViewClientClass()
	        val settings = webview.settings
	        settings.javaScriptEnabled = true
	        settings.domStorageEnabled = true
	        
	        webview.setWebChromeClient(object: WebChromeClient() {
	            //alert
	        })
	```
3. 캐시 모드는 웹뷰 기본값으로 설정한다.(WebSetting.LOAD\_CACHE\_ELSE\_NETWORK 설정 시 일부 카드사 세션 오류 발생)
	쿠키 허용 설정 (Android 5.0 이상 시 third-party 쿠키 허용 추가)
4. 웹뷰의 postUrl을 통해 결제 요청 URL을 호출한다. (가맹점 결제 요청 페이지)
	```java
	webView.postUrl(MERCHANT_URL, null);
	```
5. URI에 포함된 요청 데이터를 Intent를 통해 어플리케이션 호출(startActivity)
	Android 하위 버전의 경우 intent:// 방식이 아닌 scheme 호출 방식으로 들어올 수 있음
	해당 경우 scheme을 수동으로 추가해야 함 (ex cloudpay://~ 로 들어올 경우 if( url.startwith(“cloudpay”)
	```java
	private class WebViewClientClass : WebViewClient() {
	    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
	        println("url : " + url)
	        try {
	            if( url != null && (url.startsWith("intent:")
	                        || url.contains("market://")
	                        || url.contains("vguard")
	                        || url.contains("droidxantivirus")
	                        || url.contains("v3mobile")
	                        || url.contains(".apk")
	                        || url.contains("mvaccine")
	                        || url.contains("smartwall://")
	                        || url.contains("nidlogin://")
	                        || url.contains("onestore://")
	                        || url.contains("http://m.ahnlab.com/kr/site/download")) ) {
	                var intent: Intent? = null
	                try {
	                    intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
	                } catch (e: URISyntaxException) {
	                    println("error : " + e.printStackTrace())
	                }
	                if( view?.context?.packageManager?.resolveActivity(intent!!, 0) == null ) {
	                    val pkgName = intent?.\`package\`
	                    if( pkgName != null ) {
	                        val uri = Uri.parse("market://search?q=pname:" + pkgName)
	                        intent = Intent(Intent.ACTION_VIEW, uri)
	                        view?.context?.startActivity(intent)
	                    }
	                } else {
	                    val uri = Uri.parse(intent?.dataString)
	                    intent = Intent(Intent.ACTION_VIEW, uri)
	                    view?.context?.startActivity(intent)
	                }
	            } else {
	                if (url != null) {
	                    view?.loadUrl(url)
	                }
	            }
	        } catch (e: Exception) {
	            println("error : " + e.printStackTrace())
	            return false
	        }
	        return true
	    }
	}
	```

1. 권한설정
	AndroidManifast.xml 파일에 3rd 어플리케이션 호출을 위한 패키지명 정의, 권한 및 네트워크 보안 예외 설정을 합니다.
	```java
	<?xml version="1.0" encoding="utf-8"?>
	<manifest xmlns:android="http://schemas.android.com/apk/res/android"
	    package="sample.nicepay.co.kr.nicepayappsample">
	    
	    <queries>
	        <!--신용카드-->
	        <package android:name="kr.co.samsungcard.mpocket" />  <!--삼성 앱카드, 삼성 앱카드 공동인증서-->
	        <package android:name="com.shcard.smartpay" />  <!--신한 페이판-->
	        <package android:name="com.shinhancard.smartshinhan" />  <!--신한(ARS/일반결제/Smart결제), 신한 공동인증서-->
	        <package android:name="com.kbcard.cxh.appcard" />  <!--KBPay-->
	        <package android:name="com.kbstar.liivbank" />  <!--LiiV(국민은행)-->
	        <package android:name="com.kbstar.reboot" />  <!--new liib-->
	        <package android:name="kvp.jjy.MispAndroid320" />  <!--페이북/ISP-->
	        <package android:name="com.hanaskcard.paycla" />  <!--하나카드 원큐페이-->
	        <package android:name="kr.co.hanamembers.hmscustomer" />  <!--하나멤버스-->
	        <package android:name="com.lcacApp" />  <!--롯데 앱카드-->
	        <package android:name="nh.smart.nhallonepay" />  <!--NH 올원페이, NH 올원페이 공동인증서-->
	        <package android:name="com.wooricard.smartapp" />  <!--우리 WON 카드-->
	        <package android:name="com.wooribank.smart.npib" />  <!--우리 WON 뱅킹-->
	        <package android:name="com.hyundaicard.appcard" />  <!--현대 앱카드-->
	        <package android:name="kr.co.citibank.citimobile" />  <!--씨티카드-->
	        <package android:name="com.shinhan.smartcaremgr" />  <!--신한슈퍼SOL-->
	        <package android:name="net.ib.android.smcard" />  <!--삼성 monimo-->
	        <package android:name="com.kakaobank.channel" />  <!--카카오뱅크 앱카드-->
	        <!--공인인증-->
	        <package android:name="com.hanaskcard.rocomo.potal" />  <!--하나카드-->
	        <package android:name="com.lumensoft.touchenappfree" />  <!--공동인증서-->
	        <!--백신-->
	        <package android:name="com.TouchEn.mVaccine.webs" />  <!--TouchEn mVaccine(신한)-->
	        <package android:name="com.ahnlab.v3mobileplus" />  <!--V3(NH, 현대)-->
	        <package android:name="kr.co.shiftworks.vguardweb" />  <!--V-Guard(삼성)-->
	        <!--간편결제-->
	        <package android:name="com.samsung.android.spay" />  <!--삼성페이(삼성, 농협, KB)-->
	        <package android:name="com.samsung.android.spaylite" />  <!--삼성페이 미니(삼성, KB)-->
	        <package android:name="com.kakao.talk" />  <!--카카오페이-->
	        <package android:name="com.nhn.android.search" />  <!--네이버페이-->
	        <package android:name="com.ssg.serviceapp.android.egiftcertificate" />  <!--SSGPay(현대)-->
	        <package android:name="com.nhnent.payapp" />  <!--페이코(삼성, 농협, KB)-->
	        <package android:name="com.lge.lgpay" />  <!--엘지페이(삼성, KB)-->
	        <package android:name="com.lottemembers.android" />  <!--LPay-->
	        <package android:name="com.tencent.mm" /> <!-- 위챗페이-->
	        <package android:name="viva.republica.toss" /> <!-- 토스-->
	        <!--계좌이체-->
	        <package android:name="com.kftc.bankpay.android" />  <!--금결원-->
	        <package android:name="com.kbankwith.smartbank" />  <!--케이뱅크-->
	        <!--본인인증-->
	        <package android:name="com.sktelecom.tauth" />  <!--SKT-->
	        <package android:name="com.kt.ktauth" />  <!--KT-->
	        <package android:name="com.lguplus.smartotp" />  <!--LGT-->
	    </queries>
	    <uses-permission android:name="android.permission.INTERNET" />
	    <application
	        android:allowBackup="true"
	        android:icon="@mipmap/ic_launcher"
	        android:label="@string/app_name"
	        android:roundIcon="@mipmap/ic_launcher_round"
	        android:supportsRtl="true"
	        android:theme="@style/AppTheme"
	        android:usesCleartextTraffic="true">
	        <activity android:name=".MainActivity"
	            android:configChanges="orientation"
	            android:screenOrientation="portrait">
	            <intent-filter>
	                <action android:name="android.intent.action.MAIN" />
	                <category android:name="android.intent.category.LAUNCHER" />
	            </intent-filter>
	        </activity>
	        <activity
	            android:name=".WebViewActivity"
	            android:label="NicePay Smart"
	            android:configChanges="orientation"
	            android:screenOrientation="portrait">
	            <intent-filter>
	                <action android:name="android.intent.action.VIEW" />
	            </intent-filter>
	        </activity>
	    </application>
	</manifest>
	```
2. 웹뷰 연동
	웹뷰에서 자바스크립트 실행 가능하도록 설정 (WebViewActivity.java)
	```java
	public class WebViewActivity extends Activity {
	    private static final String TAG = "NICE";
	    private static final String MERCHANT_URL = "https://web.nicepay.co.kr/demo/v3/mobileReq.jsp";
	    private WebView mWebView = null;
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_webview);
	        mWebView = (WebView)findViewById(R.id.webview);
	        //setup default
	        mWebView.setWebViewClient(new WebViewClientClass());
	        //javascript allow
	        mWebView.getSettings().setJavaScriptEnabled(true);
	        
	        //use local storage
	        mWebView.getSettings().setDomStorageEnabled(true);
	        //alert
	        mWebView.setWebChromeClient(new WebChromeClient() {
	        });
	```
3. 캐시 모드는 웹뷰 기본값으로 설정한다.(WebSetting.LOAD\_CACHE\_ELSE\_NETWORK 설정 시 일부 카드사 세션 오류 발생)
	쿠키 허용 설정 (Android 5.0 이상 시 third-party 쿠키 허용 추가)
4. 웹뷰의 postUrl을 통해 결제 요청 URL을 호출한다. (가맹점 결제 요청 페이지)
	```java
	mWebview.postUrl(MERCHANT_URL, null)
	```
5. URI에 포함된 요청 데이터를 Intent를 통해 어플리케이션 호출(startActivity)
	Android 하위 버전의 경우 intent:// 방식이 아닌 scheme 호출 방식으로 들어올 수 있음
	해당 경우 scheme을 수동으로 추가해야 함 (ex cloudpay://~ 로 들어올 경우 if( url.startwith(“cloudpay”)
	```java
	private class WebViewClientClass extends WebViewClient {
	    @Override
	    public boolean shouldOverrideUrlLoading(WebView view, String url) {
	        Log.i(TAG,"url : " + url);
	        try {
	            if( url != null && (url.startsWith("intent:")
	                        || url.contains("market://")
	                        || url.contains("vguard")
	                        || url.contains("droidxantivirus")
	                        || url.contains("v3mobile")
	                        || url.contains(".apk")
	                        || url.contains("mvaccine")
	                        || url.contains("smartwall://")
	                        || url.contains("nidlogin://")
	                        || url.contains("onestore://")
	                        || url.contains("http://m.ahnlab.com/kr/site/download")) ) {
	                Intent intent = null;
	                try {
	                    intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
	                } catch (URISyntaxException ex) {
	                    Log.e(TAG,"[error] Bad request uri format : [" + url + "] =" + ex.getMessage());
	                    return false;
	                }
	                if( getPackageManager().resolveActivity(intent,0) == null ) {
	                    String pkgName = intent.getPackage();
	                    if( pkgName != null ) {
	                        Uri uri = Uri.parse("market://search?q=pname:" + pkgName);
	                        intent = new Intent(Intent.ACTION_VIEW, uri);
	                        startActivity(intent);
	                    }
	                } else {
	                    Uri uri = Uri.parse(intent.getDataString());
	                    intent = new Intent(Intent.ACTION_VIEW, uri);
	                    startActivity(intent);
	                }
	            } else {
	                view.loadUrl(url);
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	            return false;
	        }
	        return true;
	    }
	}
	```

1. 가맹점 어플리케이션 URL Scheme 등록 (결제 요청 전문 중 WapUrl 필드 값으로 사용)
	info.plist 파일에 URL Scheme을 등록한다. (3rd 어플리케이션 -> 가맹점 어플리케이션 호출)
	(미설정 시 특정 3rd 어플리케이션에서 인증 or 결제 완료 후 가맹점 어플리케이션으로 자동 전환 불가)
	![](https://developers.nicepay.co.kr/images/manual-ios-url-scheme.jpg)
2. info.plist 파일에 3rd URL Scheme을 등록한다. (가맹점 어플리케이션 -> 3rd 어플리케이션 호출)
	(미설정 시 3rd 어플리케이션 연동 불가)
	![](https://developers.nicepay.co.kr/images/info_plist_table_1.0.3.png)
3. HTTP 또는 유효하지 않은 인증서를 가진 HTTPS 연결 시 예외 처리
	(Apple에서는 하기와 같은 방법을 권장하지 않으며, 특정 도메인에 대해서만 예외 처리하도록 권장함)
	![](https://developers.nicepay.co.kr/images/manual-ios-network.jpg)
4. 웹뷰의 load를 통해 결제 요청 URL을 호출한다. (가맹점 결제 요청 웹 페이지)
5. URL에 포함된 App Scheme을 통해 어플리케이션 호출(openURL)
	```java
	func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
	    let request = navigationAction.request
	    let optUrl = request.url
	    let optUrlScheme = optUrl?.scheme
	    guard let url = optUrl, let scheme = optUrlScheme
	        else {
	            return decisionHandler(WKNavigationActionPolicy.cancel)
	    }
	    debugPrint("url : \(url)")
	    if( scheme != "http" && scheme != "https" ) {
	        if( scheme == "ispmobile" && !UIApplication.shared.canOpenURL(url) ) {  //ISP 미설치 시
	            UIApplication.shared.openURL(URL(string: "http://itunes.apple.com/kr/app/id369125087?mt=8")!)
	        } else if( scheme == "kftc-bankpay" && !UIApplication.shared.canOpenURL(url) ) {    //BANKPAY 미설치 시
	            UIApplication.shared.openURL(URL(string: "http://itunes.apple.com/us/app/id398456030?mt=8")!)
	        } else {
	            if( UIApplication.shared.canOpenURL(url) ) {
	                UIApplication.shared.openURL(url)
	            } else {
	                //1. App 미설치 확인
	                //2. info.plist 내 scheme 등록 확인
	            }
	        }
	    }
	    decisionHandler(WKNavigationActionPolicy.allow)
	}
	```
6. 웹뷰의 오버라이딩 함수를 재정의 하여 팝업 처리
	```java
	func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
	    let alert = UIAlertController(title: "", message: message, preferredStyle: .alert)
	    alert.addAction(UIAlertAction(title: "확인", style: .default, handler: { (UIAlertAction) in
	        completionHandler()
	    }))
	    self.present(alert, animated: true, completion: nil)
	}
	```

1. 가맹점 어플리케이션 URL Scheme 등록 (결제 요청 전문 중 WapUrl 필드 값으로 사용)
	info.plist 파일에 URL Scheme을 등록한다. (3rd 어플리케이션 -> 가맹점 어플리케이션 호출)
	(미설정 시 특정 3rd 어플리케이션에서 인증 or 결제 완료 후 가맹점 어플리케이션으로 자동 전환 불가)
	![](https://developers.nicepay.co.kr/images/manual-ios-url-scheme.jpg)
2. info.plist 파일에 3rd URL Scheme을 등록한다. (가맹점 어플리케이션 -> 3rd 어플리케이션 호출)
	(미설정 시 3rd 어플리케이션 연동 불가)
	![](https://developers.nicepay.co.kr/images/info_plist_table_1.0.3.png)
3. HTTP 또는 유효하지 않은 인증서를 가진 HTTPS 연결 시 예외 처리
	(Apple에서는 하기와 같은 방법을 권장하지 않으며, 특정 도메인에 대해서만 예외 처리하도록 권장함)
	![](https://developers.nicepay.co.kr/images/manual-ios-network.jpg)
4. 웹뷰의 loadRequest를 통해 결제 요청 URL을 호출한다. (가맹점 결제 요청 웹 페이지)
5. URL에 포함된 App Scheme을 통해 어플리케이션 호출(openURL)
	```java
	- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
	    NSURLRequest *request = navigationAction.request;
	    NSURL *url = [request URL];
	    NSString *urlScheme = [url scheme];
	    
	    NSLog(@"url : %@", url);
	    
	    if( ![urlScheme isEqualToString:@"http"] && ![urlScheme isEqualToString:@"https"] ) {
	        if( [urlScheme isEqualToString:@"ispmobile"] && ![[UIApplication sharedApplication] canOpenURL:url] ) {
	            //ISP App가 설치되어 있지 않을 경우 앱스토어로 이동
	            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://itunes.apple.com/kr/app/id369125087?mt=8"]];
	        } else if( [urlScheme isEqualToString:@"kftc-bankpay"] && ![[UIApplication sharedApplication] canOpenURL:url] ) {
	            //BANKPAY App가 설치되어 있지 않을 경우 앱스토어로 이동
	            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"http://itunes.apple.com/us/app/id398456030?mt=8"]];
	        } else {
	            if( [[UIApplication sharedApplication] canOpenURL:url] ) {
	                [[UIApplication sharedApplication] openURL:url];    //App 실행
	            } else {
	                //1. App 미설치 확인
	                //2. info.plist 내 scheme 등록 확인
	            }
	        }
	    }
	    
	    decisionHandler(WKNavigationActionPolicyAllow);
	}
	```
6. 웹뷰의 오버라이딩 함수를 재정의 하여 팝업 처리
	```java
	- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler {
	    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil
	                                                                             message:message
	                                                                      preferredStyle:UIAlertControllerStyleAlert];
	    [alertController addAction:[UIAlertAction actionWithTitle:@"확인"
	                                                        style:UIAlertActionStyleCancel
	                                                      handler:^(UIAlertAction *action) {
	                                                          completionHandler();
	                                                      }]];
	    [self presentViewController:alertController animated:YES completion:^{}];
	}
	```
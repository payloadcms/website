package sample.nicepay.co.kr.nicepayappsample;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.net.URISyntaxException;

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

        //setup cache
        /*
         * WebView에서 캐시사용 관련 Default 설정은 WebSettings.LOAD_DEFAULT 입니다.
         * ex) mWebView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
         * 가급적 캐시 사용 설정을 변경하지 않을것을 권고 드립니다.
         * @중요 : 'WebSettings.LOAD_CACHE_ELSE_NETWORK' 로 변경금지.
         * @중요 : Do not change the setting to 'WebSettings.LOAD_CACHE_ELSE_NETWORK'
        */

        mWebView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);

        //setup cookie
        mWebView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(mWebView, true);

        //load url
        mWebView.postUrl(MERCHANT_URL, null);
    }

    private class WebViewClientClass extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();

            Log.i(TAG,"url : " + url);

            try {
                if( url != null && (url.startsWith("intent:"))
                        || url.contains("market://")
                        || url.contains("vguard")
                        || url.contains("droidxantivirus")
                        || url.contains("v3mobile")
                        || url.contains(".apk")
                        || url.contains("mvaccine")
                        || url.contains("smartwall://")
                        || url.contains("nidlogin://")
                        || url.contains("onestore://")
                        || url.contains("http://m.ahnlab.com/kr/site/download") ) {
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
}

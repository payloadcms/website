package kr.co.nicepay.nicepayappsample

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.*
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_webview.*
import java.net.URISyntaxException


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

        //setup cache
        /*
         * WebView에서 캐시사용 관련 Default 설정은 WebSettings.LOAD_DEFAULT 입니다.
         * ex) settings.cacheMode = WebSettings.LOAD_DEFAULT
         * 가급적 캐시 사용 설정을 변경하지 않을것을 권고 드립니다.
         * @중요 : 'WebSettings.LOAD_CACHE_ELSE_NETWORK' 로 변경금지.
         * @중요 : Do not change the setting to 'WebSettings.LOAD_CACHE_ELSE_NETWORK'
        */
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW)
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webview, true)

        webview.loadUrl(MERCHANT_URL)
    }

    private class WebViewClientClass : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
            val url = request?.url.toString()

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
                        return false
                    }

                    if( view?.context?.packageManager?.resolveActivity(intent!!, 0) == null ) {
                        val pkgName = intent?.`package`
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
}
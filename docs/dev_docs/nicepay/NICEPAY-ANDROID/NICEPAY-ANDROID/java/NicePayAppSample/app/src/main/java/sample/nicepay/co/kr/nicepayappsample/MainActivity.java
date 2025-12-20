package sample.nicepay.co.kr.nicepayappsample;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        TextView verno = (TextView)findViewById(R.id.text_verno);
        if( verno != null ) {
            verno.setText("Ver " + BuildConfig.VERSION_NAME);
        }
    }

    public void actionPay(View v) {
        Intent intent = new Intent(MainActivity.this, WebViewActivity.class);
        if( intent != null ) {
            startActivity(intent);
        }
    }
}

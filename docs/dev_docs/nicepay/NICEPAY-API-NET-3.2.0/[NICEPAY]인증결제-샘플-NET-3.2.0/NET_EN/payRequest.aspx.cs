using System;
using System.Security.Cryptography;
using System.Text;


public partial class payRequest : System.Web.UI.Page{
    protected String goodsName;
    protected String price;
    protected String merchantID;
    protected String moid;
    protected String buyerName;
    protected String buyerTel;
    protected String buyerEmail;
    protected String returnURL;    
    protected String ediDate;
    protected String merchantKey;
    protected String hashString;
    protected String encryptData;

    protected void Page_Load(object sender, EventArgs e){
        init(); 
    }

    /********************************************************** 
    * <결제요청 파라미터>
    * 결제시 Form 에 보내는 결제요청 파라미터입니다.
    * 샘플페이지에서는 기본(필수) 파라미터만 예시되어 있으며, 
    * 추가 가능한 옵션 파라미터는 연동메뉴얼을 참고하세요.
    **********************************************************/
    public void init(){
        merchantKey      = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";   // 상점키
        merchantID       = "nicepay00m";                                         // 상점아이디
        buyerName        = "나이스";                                             // 구매자명
        buyerTel         = "01000000000";                                        // 구매자연락처
        buyerEmail       = "happy@day.co.kr";                                    // 구매자메일주소
        ediDate          = String.Format("{0:yyyyMMddHHmmss}", DateTime.Now);    // 해쉬암호화
        moid             = "mnoid1234567890";                                    // 상품주문번호	
        price            = "1004";                                               // 결제상품금액
        goodsName        = "나이스페이";                                          // 결제상품명
        returnURL        = "http://localhost:8080/nicepay3.0_utf-8/payResult.aspx"; // 결과페이지(절대경로) - 모바일 결제창 전용
        encryptData      = stringToSHA256(ediDate + merchantID + price + merchantKey);
    }

    public String stringToSHA256(String plain){
        SHA256Managed SHA256 = new SHA256Managed();
        String getHashString = BitConverter.ToString(SHA256.ComputeHash(Encoding.UTF8.GetBytes(plain))).ToLower();
        return getHashString.Replace("-", "");
    }
}

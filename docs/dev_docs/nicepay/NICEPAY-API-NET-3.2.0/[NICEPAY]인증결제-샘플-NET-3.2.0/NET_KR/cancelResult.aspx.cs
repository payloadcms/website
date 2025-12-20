using System;
using System.Web.UI;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
public partial class cancelResult : System.Web.UI.Page{
    protected System.Web.UI.WebControls.Literal Res_ResultCode;
    protected System.Web.UI.WebControls.Literal Res_ResultMsg;
    protected System.Web.UI.WebControls.Literal Res_TID;

    protected string tid;
    protected string cancelAmt;
    protected string partialCancelCode;
    protected string mid;
    protected string moid;
    protected string cancelMsg;
    protected string merchantKey;
    protected string ediDate;
    protected string signData;
    protected string resultCode;
    protected string resultMsg;
    protected string cancelDate;
    protected string cancelTime;


    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            resultData();
        }
    }

    protected void resultData()
    {
        merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
        tid = Request.Params["TID"];
        cancelAmt = Request.Params["CancelAmt"];
        partialCancelCode = Request.Params["PartialCancelCode"];
        mid = "nicepay00m";
        moid = "nicepay_api_3.0_test";
        cancelMsg = "고객취소";

        ediDate = String.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
        signData = stringToSHA256(mid + cancelAmt + ediDate + merchantKey);

        //Make post query string
        var postData = "TID=" + tid;
        postData += "&MID=" + mid;
        postData += "&Moid=" + moid;
        postData += "&CancelAmt=" + Uri.EscapeDataString(cancelAmt);
        postData += "&CancelMsg=" + cancelMsg;
        postData += "&PartialCancelCode=" + partialCancelCode;
        postData += "&EdiDate=" + ediDate;
        postData += "&EdiType=" + "KV";
        postData += "&SignData=" + Uri.EscapeDataString(signData);

        //Call cancel_process.jsp API
        var result = apiRequest("https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp", postData);

        //Stream encode
        var queryStr = streamEncode(result);

        //ParseQueryString
        var response = HttpUtility.ParseQueryString(queryStr);

        //Response data to view
        Res_ResultCode.Text = response["ResultCode"];
        Res_ResultMsg.Text = response["ResultMsg"];
        Res_TID.Text = response["TID"];
    }

    public String stringToSHA256(String plain)
    {
        SHA256Managed SHA256 = new SHA256Managed();
        String getHashString = BitConverter.ToString(SHA256.ComputeHash(Encoding.UTF8.GetBytes(plain))).ToLower();
        return getHashString.Replace("-", "");
    }

    public HttpWebResponse apiRequest(String url, String postData)
    {
        var request = (HttpWebRequest)WebRequest.Create(url);

        System.Text.Encoding euckr = System.Text.Encoding.GetEncoding(51949);
        var data = euckr.GetBytes(postData);

        request.Method = "POST";
        request.ContentType = "application/x-www-form-urlencoded";
        request.ContentLength = data.Length;

        using (var stream = request.GetRequestStream())
        {
            stream.Write(data, 0, data.Length);
        }

        var result = (HttpWebResponse)request.GetResponse();
        return result;
    }

    public String streamEncode(HttpWebResponse result)
    {
        Stream ReceiveStream = result.GetResponseStream();
        Encoding encode = System.Text.Encoding.GetEncoding(51949);

        StreamReader sr = new StreamReader(ReceiveStream, encode);

        Char[] read = new Char[8096];
        int count = sr.Read(read, 0, 8096);
        Char[] chTemp = new Char[count];
        for (int i = 0; i < count; ++i)
            chTemp[i] = read[i];

        Byte[] buffer = encode.GetBytes(chTemp);
        String strOut = encode.GetString(buffer);

        return strOut;
    }
}
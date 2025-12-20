using System;
using System.Web.UI;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
public partial class payResult : System.Web.UI.Page{
    protected System.Web.UI.WebControls.Literal Res_ResultCode;
    protected System.Web.UI.WebControls.Literal Res_ResultMsg;
    protected System.Web.UI.WebControls.Literal Res_PayMethod;
    protected System.Web.UI.WebControls.Literal Res_GoodsName;
    protected System.Web.UI.WebControls.Literal Res_Amt;
    protected System.Web.UI.WebControls.Literal Res_TID;

    protected string authResultCode;
    protected string authResultMsg;
    protected string nextAppURL;
    protected string txTid;
    protected string authToken;
    protected string payMethod;
    protected string mid;
    protected string moid;
    protected string amt;
    protected string reqReserved;
    protected string netCancelURL;
    protected string signData;
    protected string ediDate;
    protected string merchantKey;

    protected void Page_Load(object sender, EventArgs e){
        if (!Page.IsPostBack){
            resultData();
        }
    }

    protected void resultData(){
        merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
        authResultCode = Request.Params["AuthResultCode"];
        authResultMsg = Request.Params["AuthResultMsg"];
        nextAppURL = Request.Params["NextAppURL"];
        txTid = Request.Params["TxTid"];
        authToken = Request.Params["AuthToken"];
        payMethod = Request.Params["PayMethod"];
        mid = Request.Params["MID"];
        moid = Request.Params["Moid"];
        amt = Request.Params["Amt"];
        reqReserved = Request.Params["ReqReserved"];
        netCancelURL = Request.Params["NetCancelURL"];

        ediDate = String.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
        signData = stringToSHA256(authToken + mid + amt + ediDate + merchantKey);

        var postData = "TID=" + Uri.EscapeDataString(txTid);
        postData += "&AuthToken=" + Uri.EscapeDataString(authToken);
        postData += "&MID=" + Uri.EscapeDataString(mid);
        postData += "&Amt=" + Uri.EscapeDataString(amt);
        postData += "&EdiDate=" + ediDate;
        postData += "&EdiType=" + "KV";
        postData += "&SignData=" + Uri.EscapeDataString(stringToSHA256(authToken + mid + amt + ediDate + merchantKey));

        if (authResultCode.Equals("0000"))
        {
            //API Call
            var result = apiRequest(nextAppURL, postData);

            //Stream encode
            var queryStr = streamEncode(result);

            //ParseQueryString
            var response = HttpUtility.ParseQueryString(queryStr);

            //Response data
            Res_ResultCode.Text = response["ResultCode"];
            Res_ResultMsg.Text = response["ResultMsg"];
            Res_PayMethod.Text = response["PayMethod"];
            Res_GoodsName.Text = response["GoodsName"];
            Res_Amt.Text = response["Amt"];
            Res_TID.Text = response["TID"];
        }
        else
        {
            //Add parameters for Net cancel
            postData += "&NetCancel=1";

            //API Call to CancelURL
            var result = apiRequest(netCancelURL, postData);

            var queryStr = streamEncode(result);

            //ParseQueryString
            var response = HttpUtility.ParseQueryString(queryStr);

            //Response data
            Res_ResultCode.Text = response["ResultCode"];
            Res_ResultMsg.Text = response["ResultMsg"];
        }
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
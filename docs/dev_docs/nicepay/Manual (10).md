---
title: "Manual"
source: "https://developers.nicepay.co.kr/manual-noti.php"
author:
published:
created: 2025-11-29
description:
tags:
  - "clippings"
---
가맹점관리자페이지 설정 (메인화면 → 가맹점정보 클릭)

![](https://developers.nicepay.co.kr/images/noti_setting.png)

  

항목 설명

방화벽 설정

| 프로토콜 | 연결대상 |
| --- | --- |
| HTTPS   TCP | 연결방향: INBOUND   121.133.126.10   121.133.126.11   211.33.136.39 |

  

아래 통보 데이터 형식을 참고하여 가맹점 환경에 맞게 통보 데이터 수신 환경을 개발합니다.  
한글 데이터 통보시 인코딩은 EUC-KR입니다.  
샘플 코드 예시: [예시 링크](https://developers.nicepay.co.kr/manual-noti.php#noti-sample-code)

| 파라미터명 | 파라미터설명 |
| --- | --- |
| Amt | 12 byte 상품금액 (예시: 1000) |
| AuthCode | 30 byte 승인번호 |
| AuthDate | 12 byte 승인일시 (YYMMDDHHMISS) |
| BuyerAuthNum | 15 byte 구매자 식별번호 |
| BuyerEmail | 60 byte 구매자 e-mail (예시: it@nicepay.co.kr) |
| FnCd | 4 byte 제휴사코드 |
| FnName | 20 byte 제휴사명 |
| GoodsName | 40 byte 상품명 (예시: 곰인형) |
| MallUserID | 20 byte 고객 ID |
| MID | 10 byte 가맹점아이디 |
| MOID | 64 byte 주문번호 |
| name | 30 byte 구매자명 |
| PayMethod | 10 byte 지불수단 |
| RcptAuthCode | 30 byte 현금영수증 승인번호 |
| RcptTID | 30 byte 현금영수증 TID |
| RcptType | 1 byte 현금영수증 타입 (미발행: 0 / 소득공제: 1 / 지출증빙: 2) |
| ReceitType | 1 byte 현금영수증 타입, RcptType 파라미터와 동일한 값 응답 |
| ResultCode | 4 byte 결과코드 |
| ResultMsg | 100 byte 결과메세지 |
| StateCd | 1 byte 거래 상태 (승인: 0, 전취소: 1, 후취소: 2) |
| TID | 30 byte 거래ID |
| CancelDate | 12 byte 취소일시 (YYMMDDHHMISS) |
| CancelMOID | 64 byte 취소요청 주문번호 (신용카드 취소 통보 시에만 응답값 존재, 이외 결제수단은 빈 값으로 응답) |
| TransType | 1 byte 에스크로 결제 여부, 결제수단이 신용카드, 계좌이체, 가상계좌인 경우에만 응답. (0: 일반 결제, 1: 에스크로 결제) |
| MallReserved | 500 byte 가맹점 여분필드 |
| MallReserved1 | 10 byte 사업자번호 |
| MallReserved2 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved3 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved4 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved5 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved6 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved7 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved8 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved9 | 미사용 필드이며 빈 값으로 응답함 |
| MallReserved10 | 미사용 필드이며 빈 값으로 응답함 |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| CardNo | 16 byte 카드번호 (예시: 12345678\*\*\*\*1234 |
| CardQuota | 2 byte 할부개월 |
| SUB\_ID | 20 byte 서브 아이디 |
| AcquCd | 3 byte 카드 매입사 코드 |
| AcquName | 20 byte 카드 매입사명 |
| ClickpayCl | 2 byte 간편결제구분 |
| TermNo | 20 byte CATID(단말기를 사용하는 MID에 한하여 응답값 존재) |
| EdiNo | 20 byte 전문관리항목(단말기를 사용하는 MID 중 단말기(온/오프) 거래에 한하여 응답값 존재 |
| CardCl | 2 byte 카드구분(신용카드: 0, 체크카드: 1) |
| CardType | 2 byte 카드형태(개인: 01, 법인: 02, 해외: 03) |

| 파라미터명 | 파라미터설명 |
| --- | --- |
| VbankInputName | 20 byte 가상계좌 입금자명 |
| VbankName | 20 byte 가상계좌 은행명 |
| VbankNum | 20 byte 가상계좌 번호 |

```java
<%@ page  contentType="text/html; charset=euc-kr" %>
<%@ page import = "java.io.*" %>
<%@ page import = "java.util.Calendar" %>
<%

//*********************************************************************************
// 구매자가 입금하면 결제데이터 통보를 수신하여 DB 처리 하는 부분 입니다.
// 수신되는 필드에 대한 DB 작업을 수행하십시오.
// 수신필드 자세한 내용은 메뉴얼 참조
//*********************************************************************************

String PayMethod    = request.getParameter("PayMethod");        //지불수단
String MID          = request.getParameter("MID");              //상점ID
String MallUserID   = request.getParameter("MallUserID");       //회원사 ID
String Amt          = request.getParameter("Amt");              //금액
String name         = request.getParameter("name");             //구매자명
String GoodsName    = request.getParameter("GoodsName");        //상품명
String TID          = request.getParameter("TID");              //거래번호
String MOID         = request.getParameter("MOID");             //주문번호
String AuthDate     = request.getParameter("AuthDate");         //입금일시 (yyMMddHHmmss)
String ResultCode   = request.getParameter("ResultCode");       //결과코드 ('4110' 경우 입금통보)
String ResultMsg    = request.getParameter("ResultMsg");        //결과메시지
String VbankNum     = request.getParameter("VbankNum");         //가상계좌번호
String FnCd         = request.getParameter("FnCd");             //가상계좌 은행코드
String VbankName    = request.getParameter("VbankName");        //가상계좌 은행명
String VbankInputName = request.getParameter("VbankInputName"); //입금자 명
String CancelDate   = request.getParameter("CancelDate");       //취소일시

//*********************************************************************************
//가상계좌채번시 현금영수증 자동발급신청이 되었을경우 전달되며 
//RcptTID 에 값이 있는경우만 발급처리 됨
//*********************************************************************************
String RcptTID      = request.getParameter("RcptTID");          //현금영수증 거래번호
String RcptType     = request.getParameter("RcptType");         //현금 영수증 구분(0:미발행, 1:소득공제용, 2:지출증빙용)
String RcptAuthCode = request.getParameter("RcptAuthCode");     //현금영수증 승인번호

//*********************************************************************************
// 이부분에 로그파일 경로를 수정해주세요.
// 로그는 문제발생시 오류 추적의 중요데이터 이므로 반드시 적용해주시기 바랍니다.
//*********************************************************************************
String file_path = "/usr/local/jboss/jboss-as/server/pay/log/nice_vacct_noti_result.log";

File file = new File(file_path);
file.createNewFile();
FileWriter fw = new FileWriter(file_path, true);

fw.write("************************************************\r\n");
fw.write("PayMethod     : " + PayMethod + "\r\n");
fw.write("MID           : " + MID + "\r\n");
fw.write("MallUserID    : "+ MallUserID + "\r\n");
fw.write("Amt           : " + Amt + "\r\n");
fw.write("name          : " +  name + "\r\n");
fw.write("GoodsName     : " + GoodsName + "\r\n");
fw.write("TID           : "+ TID + "\r\n");
fw.write("MOID          : "+ MOID + "\r\n");
fw.write("AuthDate      : "+ AuthDate + "\r\n");
fw.write("ResultCode    : "+ ResultCode + "\r\n");
fw.write("ResultMsg     : "+ ResultMsg + "\r\n");
fw.write("VbankNum      : "+ VbankNum + "\r\n");
fw.write("FnCd          : "+ FnCd + "\r\n");
fw.write("VbankName     : "+ VbankName + "\r\n");
fw.write("VbankInputName : "+ VbankInputName + "\r\n");
fw.write("RcptTID       : "+ RcptTID + "\r\n");
fw.write("RcptType      : "+ RcptType + "\r\n");
fw.write("RcptAuthCode  : "+ RcptAuthCode + "\r\n");
fw.write("CancelDate    : "+ CancelDate + "\r\n");
fw.write("************************************************\r\n");
  
fw.close();
  
//가맹점 DB처리 
  
//**************************************************************************************************
//**************************************************************************************************
//결제 데이터 통보 설정 > “OK” 체크박스에 체크한 경우" 만 처리 하시기 바랍니다.
//**************************************************************************************************        
//TCP인 경우 OK 문자열 뒤에 라인피드 추가
//위에서 상점 데이터베이스에 등록 성공유무에 따라서 성공시에는 "OK"를 NICEPAY로
//리턴하셔야합니다. 아래 조건에 데이터베이스 성공시 받는 FLAG 변수를 넣으세요
//(주의) OK를 리턴하지 않으시면 NICEPAY 서버는 "OK"를 수신할때까지 계속 재전송을 시도합니다
//기타 다른 형태의 PRINT(out.print)는 하지 않으시기 바랍니다
//if (데이터베이스 등록 성공 유무 조건변수 = true) 
//  {
//      out.print("OK"); // 절대로 지우지 마세요
//  } 
//  else 
//  {
//      out.print("FAIL"); // 절대로 지우지 마세요
//  }
//*************************************************************************************************    
//*************************************************************************************************
 
%>
```

```php
<?php

//'**********************************************************************************
//' 구매자가 입금하면 결제데이터 통보를 수신하여 DB 처리 하는 부분 입니다.
//' 수신되는 필드에 대한 DB 작업을 수행하십시오.
//' 수신필드 자세한 내용은 메뉴얼 참조
//'**********************************************************************************

@extract($_GET);
@extract($_POST);
@extract($_SERVER);

$PayMethod      = $PayMethod;           //지불수단
$M_ID           = $MID;                 //상점ID
$MallUserID     = $MallUserID;          //회원사 ID
$Amt            = $Amt;                 //금액
$name           = $name;                //구매자명
$GoodsName      = $GoodsName;           //상품명
$TID            = $TID;                 //거래번호
$MOID           = $MOID;                //주문번호
$AuthDate       = $AuthDate;            //입금일시 (yyMMddHHmmss)
$ResultCode     = $ResultCode;          //결과코드 ('4110' 경우 입금통보)
$ResultMsg      = $ResultMsg;           //결과메시지
$VbankNum       = $VbankNum;            //가상계좌번호
$FnCd           = $FnCd;                //가상계좌 은행코드
$VbankName      = $VbankName;           //가상계좌 은행명
$VbankInputName = $VbankInputName;      //입금자 명
$CancelDate     = $CancelDate;          //취소일시

//가상계좌채번시 현금영수증 자동발급신청이 되었을경우 전달되며 
//RcptTID 에 값이 있는경우만 발급처리 됨
$RcptTID        = $RcptTID;             //현금영수증 거래번호
$RcptType       = $RcptType;            //현금 영수증 구분(0:미발행, 1:소득공제용, 2:지출증빙용)
$RcptAuthCode   = $RcptAuthCode;        //현금영수증 승인번호

//**********************************************************************************
//이부분에 로그파일 경로를 수정해주세요.
$logfile = fopen("C:\\NICEPAY20\\log\\nice_vacct_noti_result.log", "a+" );
//로그는 문제발생시 오류 추적의 중요데이터 이므로 반드시 적용해주시기 바랍니다.
//**********************************************************************************
 
fwrite( $logfile,"************************************************\r\n");
fwrite( $logfile,"PayMethod     : ".$PayMethod."\r\n");
fwrite( $logfile,"MID           : ".$MID."\r\n");
fwrite( $logfile,"MallUserID    : ".$MallUserID."\r\n");
fwrite( $logfile,"Amt           : ".$Amt."\r\n");
fwrite( $logfile,"name          : ".$name."\r\n");
fwrite( $logfile,"GoodsName     : ".$GoodsName."\r\n");
fwrite( $logfile,"TID           : ".$TID."\r\n");
fwrite( $logfile,"MOID          : ".$MOID."\r\n");
fwrite( $logfile,"AuthDate      : ".$AuthDate."\r\n");
fwrite( $logfile,"ResultCode    : ".$ResultCode."\r\n");
fwrite( $logfile,"ResultMsg     : ".$ResultMsg."\r\n");
fwrite( $logfile,"VbankNum      : ".$VbankNum."\r\n");
fwrite( $logfile,"FnCd          : ".$FnCd."\r\n");
fwrite( $logfile,"VbankName     : ".$VbankName."\r\n");
fwrite( $logfile,"VbankInputName : ".$VbankInputName."\r\n");
fwrite( $logfile,"RcptTID       : ".$RcptTID."\r\n");
fwrite( $logfile,"RcptType      : ".$RcptType."\r\n");
fwrite( $logfile,"RcptAuthCode  : ".$RcptAuthCode."\r\n");
fwrite( $logfile,"CancelDate    : ".$CancelDate."\r\n");
fwrite( $logfile,"************************************************\r\n");

fclose( $logfile );

//가맹점 DB처리
  
//**************************************************************************************************
//**************************************************************************************************
//결제 데이터 통보 설정 > “OK” 체크박스에 체크한 경우" 만 처리 하시기 바랍니다.
//**************************************************************************************************
//TCP인 경우 OK 문자열 뒤에 라인피드 추가
//위에서 상점 데이터베이스에 등록 성공유무에 따라서 성공시에는 "OK"를 NICEPAY로
//리턴하셔야합니다. 아래 조건에 데이터베이스 성공시 받는 FLAG 변수를 넣으세요
//(주의) OK를 리턴하지 않으시면 NICEPAY 서버는 "OK"를 수신할때까지 계속 재전송을 시도합니다
//기타 다른 형태의 PRINT(out.print)는 하지 않으시기 바랍니다
//if (데이터베이스 등록 성공 유무 조건변수 = true)
//{
//            echo "OK";                        // 절대로 지우지마세요
//}
//else 
//{
//            echo "FAIL";                        // 절대로 지우지마세요
//}
//*************************************************************************************************    
//*************************************************************************************************
?>
```

```csharp
using System;
using System.Web.UI;
using System.IO;

public partial class niceVacctNoti : System.Web.UI.Page
{
    protected string LogPath;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            responseVacctNoti();
        }
    }

    protected void responseVacctNoti()
    {
        String sPayMethod      = Request.Params["PayMethod"];          // 지불수단
        String sMID            = Request.Params["MID"];                // 상점ID
        String sMallUserID     = Request.Params["MallUserID"];         // 회원사 ID
        String sAmt            = Request.Params["Amt"];                // 금액
        String sName           = Request.Params["name"];               // 구매자명
        String sGoodsName      = Request.Params["GoodsName"];          // 상품명
        String sTID            = Request.Params["TID"];                // 거래번호
        String sMOID           = Request.Params["MOID"];               // 주문번호
        String sAuthDate       = Request.Params["AuthDate"];           // 입금일시 (yyMMddHHmmss)
        String sResultCode     = Request.Params["ResultCode"];         // 결과코드 ('4110' 경우 입금통보)
        String sResultMsg      = Request.Params["ResultMsg"];          // 결과메시지
        String sVbankNum       = Request.Params["VbankNum"];           // 가상계좌번호
        String sFnCd           = Request.Params["FnCd"];               // 가상계좌 은행코드
        String sVbankName      = Request.Params["VbankName"];          // 가상계좌 은행명
        String sVbankInputName = Request.Params["VbankInputName"];     // 입금자 명
        String sCancelDate     = Request.Params["CancelDate"];         // 취소일시
 
        // 가상계좌채번시 현금영수증 자동발급신청이 되었을경우 전달 (RcptTID, RcptType, RcptAuthCode)
        String sRcptTID        = Request.Params["RcptTID"];            // 현금영수증 거래번호
        String sRcptType       = Request.Params["RcptType"];           // 현금 영수증 구분(0:미발행, 1:소득공제용, 2:지출증빙용)
        String sRcptAuthCode   = Request.Params["RcptAuthCode"];       // 현금영수증 승인번호

        // 로그파일 
        FileInfo file = new FileInfo(@"C:\log\nice_vacct_noti_result.log");
        StreamWriter sw = file.AppendText();
        sw.WriteLine("************************************************");
        sw.WriteLine("PayMethod      : " + sPayMethod);
        sw.WriteLine("M_ID           : " + sMID);
        sw.WriteLine("MallUserID     : " + sMallUserID);
        sw.WriteLine("Amt            : " + sAmt);
        sw.WriteLine("name           : " + sName);
        sw.WriteLine("GoodsName      : " + sGoodsName);
        sw.WriteLine("TID            : " + sTID);
        sw.WriteLine("MOID           : " + sMOID);
        sw.WriteLine("AuthDate       : " + sAuthDate);
        sw.WriteLine("ResultCode     : " + sResultCode);
        sw.WriteLine("ResultMsg      : " + sResultMsg);
        sw.WriteLine("VbankNum       : " + sVbankNum);
        sw.WriteLine("FnCd           : " + sFnCd);
        sw.WriteLine("VbankName      : " + sVbankName);
        sw.WriteLine("VbankInputName : " + sVbankInputName);
        sw.WriteLine("RcptTID        : " + sRcptTID);
        sw.WriteLine("RcptType       : " + sRcptType);
        sw.WriteLine("RcptAuthCode   : " + sRcptAuthCode);
        sw.WriteLine("CancelDate     : " + sCancelDate);        
        sw.WriteLine("************************************************");
        sw.WriteLine("");
        sw.Flush();
        sw.Close();

        /****************************************************
         * <결제 결과 가맹점 데이터베이스 처리>
         * 
         * 가상계좌 입금결과를 가맹점 입금완료 처리를 위해
         * 데이터베이스 처리를 하시기 바랍니다.
         * 
        ****************************************************/

        bool insertSuccess = true; // 가맹점 데이터베이스 처리가 완료된 것으로 가정합니다.

        // 가맹점 DB처리 - 결제 데이터 통보 설정 > “OK” 체크박스에 체크한 경우" 만 처리 하시기 바랍니다.
        // TCP인 경우 OK 문자열 뒤에 라인피드 추가
        if (insertSuccess == true) {
            Response.Write("OK");
            Response.End();
        } else {
            Response.Write("FAIL");
            Response.End();
        }
    }
}
```
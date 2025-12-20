const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000
const iconv = require('iconv-lite')
const request = require('request')
const bodyParser = require('body-parser')
const CryptoJS = require('crypto-js')
const format = require('date-format');
const fs = require('fs')
const ejs = require('ejs')

const payRequest = fs.readFileSync('./public/payRequest.ejs', 'utf-8');
const cancelRequest = fs.readFileSync('./public/cancelRequest.ejs', 'utf-8');

const merchantKey = 'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==';
const merchantID = 'nicepay00m';

const ediDate = format.asString('yyyyMMddhhmmss', new Date());
const amt = '1004';
const returnURL = 'http://localhost:3000/authReq';
const goodsName = '나이스상품';
const moid = 'moid' + ediDate;
const buyerName = '구매자';
const buyerEmail = 'happy@day.com';
const buyerTel = '00000000000';

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

//route for payment
app.get('/payment', function(req, res) {
    const index = ejs.render(payRequest, {
        goodsName : goodsName,
        amt : amt,
        moid : moid,
        buyerName : buyerName,
        buyerEmail : buyerEmail,
        buyerTel : buyerTel,
        merchantID: merchantID,
        ediDate: ediDate,
        hashString : getSignData(ediDate + merchantID + amt + merchantKey).toString(),
        returnURL: returnURL
    })

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(index)
    res.end()
})

//route for cancel
app.get('/cancel', function(req, res) {
    const index = ejs.render(cancelRequest, {

    })

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(index)
    res.end()
})

//authentication from client
app.post('/authReq', async function(req, res) {

    const authResultCode = req.body.AuthResultCode;
    const authResultMsg = req.body.AuthResultMsg;
    const txTid = req.body.TxTid;
    const authToken = req.body.AuthToken;
    const payMethod = req.body.PayMethod;
    const mid = req.body.MID;
    const moid = req.body.Moid;
    const amt = req.body.Amt;
    const reqReserved = req.body.ReqReserved;
    const nextAppURL = req.body.NextAppURL; //승인 API URL
    const netCancelURL = req.body.NetCancelURL;  //API 응답이 없는 경우 망취소 API 호출
    //const authSignature = req.body.Signature; //Nicepay에서 내려준 응답값의 무결성 검증 Data
	//인증 응답 Signature = hex(sha256(AuthToken + MID + Amt + MerchantKey)
    //const authComparisonSignature = getSignData(req.body.AuthToken + req.body.MID + req.body.Amt + merchantKey).toString();
  
	if (authResultCode === "0000") {
        const ediDate = format.asString('yyyyMMddhhmmss', new Date());
        const signData = getSignData(authToken + mid + amt + ediDate + merchantKey).toString();

        try {
            const response = await axios({
                url: nextAppURL,
                method: 'POST',
                headers: {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
                },
                data: {
                    TID: txTid,
                    AuthToken: authToken,
                    MID: mid,
                    Amt: amt,
                    EdiDate: ediDate,
                    SignData: signData,
                    CharSet: 'utf-8'    
                } 
            });

            console.log('승인 결과:', response.data);
            res.json(response.data);
        } catch (error) {
            console.error('승인 요청 실패', error.message);

            try {
                const netCancelResponse = await axios({
                    url: netCancelURL,
                    method: 'POST',
                    headers: {
                        'User-Agent': 'Super Agent/0.0.1',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
                    },
                    data: {
                        TID: txTid,
                        AuthToken: authToken,
                        MID: mid,
                        Amt: amt,
                        EdiDate: ediDate,
                        SignData: signData,
                        NetCancel: '1',
                        CharSet: 'utf-8'    
                    }
                });

                console.log('망취소 결과:', netCancelResponse.data);
                res.json(netCancelResponse.data);
            } catch (cancelError) {
                console.error('망취소 실패', cancelError.message);
                res.status(500).json({ success: false, message: '결제 승인 및 망취소 요청 모두 실패했습니다.' });
            }
        }
    } else {
        res.status(400).json({ success: false, message: '결제 인증 실패', AuthResultCode: authResultCode, AuthResultMsg: req.body.AuthResultMsg });
    }

})

//cancel request
app.post('/cancelReq', async function(req, res) {

	const ediDate = format.asString('yyyyMMddhhmmss', new Date());
    
	const tid = req.body.TID;
    const moid = 'moid' + ediDate;
    const cancelAmt = req.body.CancelAmt;
    const cancelMsg = 'test'; 
    const partialCancelCode = req.body.PartialCancelCode;	
	
    const signData = getSignData(merchantID + cancelAmt + ediDate + merchantKey).toString();
	

    // Configure the request
    try {
        const cancelResponse = await axios({
            url: 'https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp',
            method: 'POST',
            headers: {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr',
            },
            data: {
                TID: tid,
                MID: merchantID,
                Moid: moid,
                CancelAmt: cancelAmt,
                CancelMsg: cancelMsg, // 취소 메세지 한글 처리 시 인코딩 euc-kr로 요청.
                PartialCancelCode: partialCancelCode,
                EdiDate: ediDate,
                SignData: signData,
                CharSet: 'utf-8'    
            }
        });

        res.json(cancelResponse.data);
        console.log('취소 결과 :', cancelResponse.data);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
})
 
function getSignData(str) {
    const encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

app.listen(port, () => console.log('**\n\nPAYMENT TEST URL:: localhost:3000/payment\nCANCEL TEST URL:: localhost:3000/cancel \n\n**'))
/*
instead of store our JWT in front end "local Storage" and send with every req ,
SO I need back end send cookie after auth-ed "by res.cookie()"
then when server recieve any req he will access cookies "BY cookie-parser package" to check if JWT in ? if JWT in cookie SO he will verify it by secret key 
So I don't need any more to extract JWT from header , I will extract it from cookies 
SO in post man after that you don't need to send token in body , because it will be in cookie tab and send auto
************************
like max frontEnd will terminate JWT after logout , backent don't handle it 
but if you want to handle it you will res.clearCookie("access_token") only
*/
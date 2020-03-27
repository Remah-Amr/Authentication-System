/*
LocalStrategy : take care about username and password if client entered them correctly or not
by default LocalStrategy chech username & password , So if I want to check email , so I write usernameField: 'email'
done like next , I will return with user OR not , so first arg take if err occured , second one take USER
when I return user successfully like : done(null,user) , IT will be assigned auto to req.user = user"which I fetch from database"
So : I use LocalStrategy when I "login" to ensure user is found with given email , second to ensure password is correct
I put session to false because I'm in API "stateless" 

JwtStrategy : 
It's check if I allow to access the recources OR not , So it protect recources from unauthorized access 
So I put it pre any route should be protected
It take the token and verify it , then decode and result is "payload" 
==>
It divide to object & function 
object take care about 2 things : 
from where part in req I should extract my token ? 
second THE secret key I used in sign token , because strategy will decode the given token
I think : if(!user) {return done(null,false)} => doesn't important
when I return user successfully like : done(null,user) , IT will be assigned auto to req.user = user"which I fetch from database"



SESSION & cokies :
SEE pics 

Cookies or URL parameters ( for ex. like http://example.com/myPage?asd=lol&boo=no ) are both suitable ways to transport data between 2 or more request. However they are not good in case you don't want that data to be readable/editable on client side.

The solution is to store that data server side, give it an "id", and let the client only know (and pass back at every http request) that id. There you go, sessions implemented. Or you can use the client as a convenient remote storage, but you would encrypt the data and keep the secret server-side.

Of course there are other aspects to consider, like you don't want people to hijack other's sessions, you want sessions to not last forever but to expire, and so on.

In your specific example, the user id (could be username or another unique ID in your user database) is stored in the session data, server-side, after successful identification. Then for every HTTP request you get from the client, the session id (given by the client) will point you to the correct session data (stored by the server) that contains the authenticated user id - that way your code will know what user it is talking to.
Browser create cookie which have session's ID
will send to server , then each sessionID in browser refer to certain session DATA in server
With every req browser send than sessionID to server for allow access the recources
IF i logout then I will terminate Session 
Because HTTP is stateless, in order to associate a request to any other request, you need a way to store user data between HTTP requests.

*/
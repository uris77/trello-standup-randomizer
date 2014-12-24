import com.mongodb.BasicDBObject
import com.mongodb.DBCollection
import com.mongodb.DBObject
import jodd.http.HttpResponse
import org.pac4j.oauth.client.Google2Client
import org.standup.auth.AuthPathAuthorizer
import org.standup.auth.CurrentUser
import org.standup.datastore.MongoDBClient
import org.standup.datastore.MongoDBModule
import org.standup.errors.ErrorHandler
import ratpack.error.ServerErrorHandler
import ratpack.groovy.templating.TemplatingModule
import ratpack.jackson.Jackson
import ratpack.jackson.JacksonModule
import ratpack.pac4j.Pac4jModule
import ratpack.registry.NotInRegistryException
import ratpack.session.SessionModule
import ratpack.session.store.MapSessionsModule
import ratpack.session.store.SessionStorage
import jodd.http.HttpRequest
import static ratpack.groovy.Groovy.groovyTemplate
import static ratpack.groovy.Groovy.ratpack

ratpack {
    bindings {
        add new SessionModule()
        add new MapSessionsModule(10, 5)
        add new JacksonModule()
        add new TemplatingModule()
        Google2Client google2Client = new Google2Client(System.getProperty("GOOGLE_ID"), System.getProperty("GOOGLE_SECRET"))
        add new Pac4jModule<>(google2Client, new AuthPathAuthorizer())
        add new MongoDBModule()

        bind ServerErrorHandler, ErrorHandler
    }

    handlers {
        handler{SessionStorage  sessionStorage ->
            try{
                CurrentUser currentUser = new CurrentUser()
                currentUser.setSessionStorage(sessionStorage)
                request.add(currentUser)
            } catch(NotInRegistryException ex){}
            finally {
                next()
            }
        }

        prefix("trello") {
            get("key") {
                render Jackson.json(System.getProperty("TRELLO_KEY"))
            }

            get("user") {CurrentUser currentUser, MongoDBClient mongoDBClient ->
                if(currentUser.email) {
                    BasicDBObject queryDoc = new BasicDBObject("email", currentUser.email)
                    BasicDBObject userDoc = mongoDBClient.getCollection("trello_members").findOne(queryDoc)
                    def userToken = userDoc.get("token")
                    if(userToken) currentUser.token = userToken
                    render Jackson.json([user: [email: currentUser.email, token: currentUser.token]])
                } else {
                    response.status(401)
                    render Jackson.json([])
                }

            }
        }

        prefix("standup") {

            handler { CurrentUser currentUser ->
                if(currentUser.isLoggedIn()) {
                    next()
                } else {
                    redirect(401, "unauthorized")
                }
            }

            handler { CurrentUser currentUser, MongoDBClient mongoDBClient ->
                BasicDBObject query = new BasicDBObject("email", currentUser.email)
                DBObject trelloAccount = mongoDBClient.getCollection("trello_members").findOne(query)
                if(trelloAccount) {
                    currentUser.token = trelloAccount.get("token")
                    request.add(trelloAccount)
                } else {
                    BasicDBObject newTrelloAccount = new BasicDBObject("email", currentUser.email)
                    mongoDBClient.getCollection("trello_members").save(newTrelloAccount)
                    request.add(newTrelloAccount)
                }

                next()
            }

            get("boards") {CurrentUser currentUser ->
                String trelloKey = System.getProperty("TRELLO_KEY")
                String uri = "https://api.trello.com/1/members/me/boards?key=${trelloKey}&token=${currentUser.token}"
                HttpRequest httpRequest = HttpRequest.get(uri)
                HttpResponse httpResponse = httpRequest.send()
                render httpResponse.bodyText()
            }

            get("members/:boardId"){ CurrentUser currentUser ->
                String trelloKey = System.getProperty("TRELLO_KEY")
                String uri = "https://api.trello.com/1/boards/${pathTokens.boardId}/members?fields=all&key=${trelloKey}&token=${currentUser.token}"
                HttpResponse httpResponse = HttpRequest.get(uri).send()
                render httpResponse.bodyText();
            }


            get("unauthorized") {
                response.status(401)
                render Jackson.json([])
            }

            post("token") { CurrentUser currentUser, MongoDBClient mongoDBClient ->
                blocking {
                    Map payload = parse Map
                    BasicDBObject query = new BasicDBObject("email", currentUser.email)
                    BasicDBObject updateDoc = new BasicDBObject("token", payload.token)
                    DBCollection dbCollection = mongoDBClient.getCollection("trello_members")
                    dbCollection.update(query, new BasicDBObject('$set', updateDoc))
                    dbCollection.findOne(new BasicDBObject(query))
                } then {BasicDBObject doc ->
                    currentUser.token = doc.get("token")
                    render Jackson.json([user: [email: currentUser.email, token: currentUser.token]])
                }

            }

            get {CurrentUser currentUser ->
                render groovyTemplate("index.html")
            }
        }

        get { SessionStorage sessionStorage ->
            render groovyTemplate("index.html")
        }

        assets 'public'
    }
}
package org.standup.errors

import groovy.util.logging.Slf4j
import org.codehaus.groovy.runtime.StackTraceUtils
import ratpack.error.ServerErrorHandler
import ratpack.handling.Context
import static ratpack.groovy.Groovy.groovyTemplate

@Slf4j
class ErrorHandler implements ServerErrorHandler {

    @Override
    void error(Context context, Throwable throwable) throws Exception {
        log.warn "An error occurred ", throwable
        context.with {
            render groovyTemplate("error.html", [
                    title: "Exception",
                    exception: throwable,
                    sanitizedException: StackTraceUtils.deepSanitize(throwable)
                ])
        }
    }
}

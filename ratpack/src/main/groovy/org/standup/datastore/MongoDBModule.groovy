package org.standup.datastore

import com.google.inject.AbstractModule
import com.google.inject.Scopes

class MongoDBModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(MongoDBClient.class).in(Scopes.SINGLETON)
    }
}

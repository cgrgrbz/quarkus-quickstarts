# optaplanner-quickstart project

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```
./mvnw quarkus:dev
```

## Packaging and running the application

The application is packageable using `./mvnw package`.
It produces the executable `optaplanner-quickstart-1.0-SNAPSHOT-runner.jar` file in `/target` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/lib` directory.

The application is now runnable using `java -jar target/optaplanner-quickstart-1.0-SNAPSHOT-runner.jar`.

## Creating a native executable

Since quarkus h2 extension does not support compiling the embedded database engine into native images,
you need to run the h2 server and connect to it in client mode:
 1. Donwload latest [h2 engine](http://www.h2database.com/html/download.html) (Platform-independent zip)
 2. Start h2 server with the option `-ifNotExists` (this is not recommended in production but will save you from creating the database manually)
     ```shell script
    cd <donwload_dir>
    unzip h2*.zip
    cd h2/bin
    java -cp h2*.jar org.h2.tools.Server -ifNotExists
    ```
 3. Change `quarkus.datasource.url` in `application.properties` to use the remote server (comment line 3 and uncomment line 6)
 4. Follow the instructions below to create a native executable and run it

You can create a native executable using: `./mvnw package -Pnative`.

Or you can use Docker to build the native executable using: `./mvnw package -Pnative -Dquarkus.native.container-build=true`.

You can then execute your binary: `./target/optaplanner-quickstart-1.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/building-native-image-guide .
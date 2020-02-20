package org.acme.optaplanner.rest;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.acme.optaplanner.domain.Room;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;

@QuarkusTest
public class RoomResourceTest {

    @Test
    void testAddARoom() {
        Room roomObject = given()
                .when()
                .contentType(ContentType.JSON)
                .body(new Room("Room TEST"))
                .post("/rooms")
                .then()
                .statusCode(202)
                .extract().as(Room.class);

        given()
                .when()
                .delete("/rooms/{roomId}", roomObject.getId())
                .then()
                .statusCode(200);
    }

}

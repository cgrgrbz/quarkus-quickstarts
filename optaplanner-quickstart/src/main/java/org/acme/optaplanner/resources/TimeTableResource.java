package org.acme.optaplanner.resources;

import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.acme.optaplanner.domain.Lesson;
import org.acme.optaplanner.domain.Room;
import org.acme.optaplanner.domain.TimeTable;
import org.acme.optaplanner.domain.Timeslot;

@Path("/timeTable")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Transactional
public class TimeTableResource {

    // To try, open http://localhost:8080/timeTable
    @GET
    public TimeTable refreshTimeTable() {
        return new TimeTable(Timeslot.listAll(), Room.listAll(), Lesson.listAll());
    }

    @POST
    @Path("/solve")
    public Response solve() {
        return Response.status(Response.Status.NOT_IMPLEMENTED).build();
    }

    @POST
    @Path("/stopSolving")
    public Response stopSolving() {
        return Response.status(Response.Status.NOT_IMPLEMENTED).build();
    }

}

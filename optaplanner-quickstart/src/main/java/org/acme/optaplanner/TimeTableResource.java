package org.acme.optaplanner;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

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
    public String solve() {
        return "Method not supported yet";
    }

    @POST
    @Path("/addLesson")
    public void addLesson(Lesson lesson) {
        //TODO check status code when adding a lesson
        Lesson.persist(lesson);
    }

    @POST
    @Path("/addTimeslot")
    public void addTimeslot(Timeslot timeslot) {
        Timeslot.persist(timeslot);
    }

    // To try:  curl -d '{"name":"Room Z"}' -H "Content-Type: application/json" -X POST http://localhost:8080/timeTable/addRoom
    @POST
    @Path("/addRoom")
    public void addRoom(Room room) {
        System.out.println(room);
        Room.persist(room);
    }

    @PostConstruct
    @Transactional
    public void generateProblem() {
        List<Timeslot> timeslotList = new ArrayList<>(10);
        timeslotList.add(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(8, 30), LocalTime.of(9, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(9, 30), LocalTime.of(10, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(10, 30), LocalTime.of(11, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(13, 30), LocalTime.of(14, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(14, 30), LocalTime.of(15, 30)));

        timeslotList.add(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(8, 30), LocalTime.of(9, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(9, 30), LocalTime.of(10, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(10, 30), LocalTime.of(11, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(13, 30), LocalTime.of(14, 30)));
        timeslotList.add(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(14, 30), LocalTime.of(15, 30)));
        Timeslot.persist(timeslotList);

        List<Room> roomList = new ArrayList<>(3);
        roomList.add(new Room("Room A"));
        roomList.add(new Room("Room B"));
        roomList.add(new Room("Room C"));
        Room.persist(roomList);

        List<Lesson> lessonList = new ArrayList<>();
        lessonList.add(new Lesson("Math", "B. May", "9th grade"));
        lessonList.add(new Lesson("Math", "B. May", "9th grade"));
        lessonList.add(new Lesson("Physics", "M. Curie", "9th grade"));
        lessonList.add(new Lesson("Chemistry", "M. Curie", "9th grade"));
        lessonList.add(new Lesson("Geography", "M. Polo", "9th grade"));
        lessonList.add(new Lesson("History", "I. Jones", "9th grade"));
        lessonList.add(new Lesson("English", "I. Jones", "9th grade"));
        lessonList.add(new Lesson("English", "I. Jones", "9th grade"));
        lessonList.add(new Lesson("Spanish", "P. Cruz", "9th grade"));
        lessonList.add(new Lesson("Spanish", "P. Cruz", "9th grade"));

        lessonList.add(new Lesson("Math", "B. May", "10th grade"));
        lessonList.add(new Lesson("Math", "B. May", "10th grade"));
        lessonList.add(new Lesson("Math", "B. May", "10th grade"));
        lessonList.add(new Lesson("Physics", "M. Curie", "10th grade"));
        lessonList.add(new Lesson("Chemistry", "M. Curie", "10th grade"));
        lessonList.add(new Lesson("Geography", "M. Polo", "10th grade"));
        lessonList.add(new Lesson("History", "I. Jones", "10th grade"));
        lessonList.add(new Lesson("English", "P. Cruz", "10th grade"));
        lessonList.add(new Lesson("Spanish", "P. Cruz", "10th grade"));
        lessonList.add(new Lesson("French", "M. Curie", "10th grade"));

        lessonList.get(4).setTimeslot(timeslotList.get(2));
        lessonList.get(4).setRoom(roomList.get(0));
        lessonList.get(5).setTimeslot(timeslotList.get(3));
        lessonList.get(5).setRoom(roomList.get(1));
        lessonList.get(6).setTimeslot(timeslotList.get(3));
        lessonList.get(6).setRoom(roomList.get(1));
        Lesson.persist(lessonList);
    }
}

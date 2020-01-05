/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.acme.optaplanner.domain;

import java.util.List;

//@PlanningSolution
public class TimeTable {

//    @ProblemFactCollectionProperty
//    @ValueRangeProvider(id = "timeslotRange")
    private List<Timeslot> timeslotList;
//    @ProblemFactCollectionProperty
//    @ValueRangeProvider(id = "roomRange")
    private List<Room> roomList;
//    @PlanningEntityCollectionProperty
    private List<Lesson> lessonList;

//    @PlanningScore
//    private HardSoftScore score;

    // Ignored by OptaPlanner, used by the UI to display solve or stop solving button
//    private SolverStatus solverStatus;

    private TimeTable() {
    }

    public TimeTable(List<Timeslot> timeslotList, List<Room> roomList, List<Lesson> lessonList) {
        this.timeslotList = timeslotList;
        this.roomList = roomList;
        this.lessonList = lessonList;
    }

    public List<Timeslot> getTimeslotList() {
        return timeslotList;
    }

    public List<Room> getRoomList() {
        return roomList;
    }

    public List<Lesson> getLessonList() {
        return lessonList;
    }

//    public HardSoftScore getScore() {
//        return score;
//    }
//
//    public SolverStatus getSolverStatus() {
//        return solverStatus;
//    }

//    public void setSolverStatus(SolverStatus solverStatus) {
//        this.solverStatus = solverStatus;
//    }

}

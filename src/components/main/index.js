import React, { useState, useEffect } from "react";

import firebase, { db } from "../../firebase";
import Header from "../Header";
import ShowTodoList from "../todo/ShowTodoList";
import ShowSchedule from "../schedule/showSchedule";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  Schedule: {
    width: "800px",
  },
  ScheduleTitle: {
    "font-weight": "400",
    "text-align": "center",
  },
  ScheduleContentBox: {
    "background-color": "#CBCBCB",
  },
  ScheduleContent: {
    margin: "40px 30px",
  },
});

/**
 * homeページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export default function Main(props) {
  /** メイン表示する時間割 */
  const [schedule, setSchedule] = useState(null);
  /** 既に登録されているtodolist */
  const [todoList, setTodoList] = useState([]);
  /** todolistを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = useState(true);

  /** CSSを用いたスタイル定義 */
  const classes = styles();
  /**
   * 既に登録されている時間割を取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  }, [needLoad || props]);

  /**
   * 既に登録されているtodoを取得している
   */
  useEffect(() => {
    const data = async () => {
      await getTodoData();
    };
    data();
  }, [schedule]);
  /**
   * firestoreに存在しているtodoを取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData() {
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map((doc) => doc.data());
    const schedules = docs.filter((item) => item.uid === props.user);
    setSchedule(schedules[0]);
  }

  /**
   * firestoreに存在しているtodoを取得している
   * メイン時間割が更新されると発火する
   */
  async function getTodoData() {
    if (schedule) {
      const result_list = [];
      const subRef = db
        .collection("schedule")
        .doc(schedule.docId)
        .collection("lesson");
      const subSnapshots = await subRef.get();
      const lessons = subSnapshots.docs.map((doc) => doc.data());

      for (let j = 0; j < lessons.length; j++) {
        const subsubRef = db
          .collection("schedule")
          .doc(schedule.docId)
          .collection("lesson")
          .doc(lessons[j].docId)
          .collection("todo");
        const subsubSnapshots = await subsubRef.get();
        subsubSnapshots.docs.map((doc) => {
          if (!doc.data().done) {
            let tmp = {};
            tmp.todo = doc.data();
            tmp.lesson = lessons[j];
            tmp.schedule = schedule;
            result_list.push(tmp);
          }
        });
      }
      setTodoList([]);
      setTodoList([...result_list]);
    } else {
      setTodoList([]);
    }
  }

  /**
   * 呼び出されるとtodolistを更新する
   * 具体的にはtodolistを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    setNeedLoad(!needLoad);
  }

  return (
    <Grid direction="column">
      <Header />
      <Grid
        item
        container
        direction="row"
        spacing={10}
        alignItems="center"
        justify="center"
      >
        <Grid item container direction="column" className={classes.Schedule}>
          <Grid item>
            {(() => {
              console.log(schedule);
              if (schedule) {
                return (
                  <h2 className={classes.ScheduleTitle}>{schedule.title}</h2>
                );
              } else {
                return <h2 className={classes.ScheduleTitle}>読み込み中</h2>;
              }
            })()}
          </Grid>
          <Grid item className={classes.ScheduleContentBox}>
            <Grid item className={classes.ScheduleContent}>
              <ShowSchedule schedule={schedule} needLoad={needLoad} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ShowTodoList
            todoList={[
              ...todoList.sort((a, b) => {
                if (a.todo.limit.seconds < b.todo.limit.seconds) return -1;
                if (a.todo.limit.seconds > b.todo.limit.seconds) return 1;
                return 0;
              }),
            ]}
            handleChange={handleChange}
            user={props.user}
            msg="Todo"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

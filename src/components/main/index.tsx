import * as React from "react";

import firebase, { db } from "../../firebase";
import { Header } from "../Header";
import { ShowTodoList } from "../todo/ShowTodoList";
import { ShowSchedule } from "../schedule/showSchedule";

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

interface ITodoData {
  schedule: firebase.firestore.DocumentData;
  lesson: firebase.firestore.DocumentData;
  todo: firebase.firestore.DocumentData;
}
interface IMainProps {
  user: string;
}

/**
 * homeページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export const Main: React.FC<IMainProps> = (props) => {
  /** メイン表示する時間割 */
  const [
    schedule,
    setSchedule,
  ] = React.useState<firebase.firestore.DocumentData | null>(null);
  /** 既に登録されているtodolist */
  const [todoList, setTodoList] = React.useState<ITodoData[]>([]);
  /** todolistを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = React.useState(true);

  /** CSSを用いたスタイル定義 */
  const classes = styles();
  /**
   * 既に登録されている時間割を取得している
   */
  React.useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  }, [needLoad || props]);

  /**
   * 既に登録されているtodoを取得している
   */
  React.useEffect(() => {
    const data = async () => {
      await getTotalTodoData();
    };
    data();
  }, [schedule]);
  /**
   * firestoreに存在しているtodoを取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData(): Promise<void> {
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map((doc) => doc.data());
    const schedules = docs.filter((item) => item.uid === props.user);
    setSchedule(schedules[0]);
  }

  interface ITodoList {
    [name: string]: firebase.firestore.DocumentData | null;
  }

  /**
   * firestoreに存在しているtodoを取得している
   * メイン時間割が更新されると発火する
   */
  async function getTotalTodoData(): Promise<void> {
    setTodoList([]);

    if (schedule) {
      const subRef = db
        .collection("schedule")
        .doc(schedule.docId)
        .collection("lesson");
      const subSnapshots = await subRef.get();
      const lessons = subSnapshots.docs.map((doc) => doc.data());

      const promise_list = lessons.map((lesson) => {
        return getTodoData(schedule, lesson);
      });

      const tmp: ITodoData[] = [];
      await Promise.all(promise_list)
        .then((total_list) => {
          return total_list.map((todo_list) => {
            todo_list.map((todo) => tmp.push(todo))
          });
        })
        .catch((err) => console.log(err));
      setTodoList(tmp);
    }
  }

  /**
   * 受け取った時間割からTodoの情報を取得する
   */
  async function getTodoData(
    schedule: firebase.firestore.DocumentData,
    lesson: firebase.firestore.DocumentData
  ): Promise<ITodoData[]> {
    const subRef = db
      .collection("schedule")
      .doc(schedule.docId)
      .collection("lesson")
      .doc(lesson.docId)
      .collection("todo");
    const snapshots = await subRef.get();
    const result: ITodoData[] = [];
    snapshots.docs
      .filter((doc) => !doc.data().done)
      .map((doc) => {
        const tmp: ITodoData = {
          todo: doc.data(),
          lesson: lesson,
          schedule: schedule,
        };
        return result.push(tmp);
      });
    return result;
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
};

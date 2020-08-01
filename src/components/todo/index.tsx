import * as React from "react";

import firebase, { db } from "../../firebase";

import { Header } from "../Header";
import { CreateTodoDialog } from "./CreateTodoDialog";
import { ShowTodoList } from "./ShowTodoList";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { getDefaultNormalizer } from "@testing-library/react";
import { Schedule } from "../schedule";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  TitleText: {
    "text-align": "center",
    "font-weight": "400",
  },
});

interface ITodoProps {
  user: string;
}
/**
 * todoページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export const Todo: React.FC<ITodoProps> = (props) => {
  /** 既に登録されているtodolist */
  const [todoList, setTodoList] = React.useState([]);
  /** todolistを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = React.useState(true);

  /** CSSを用いたスタイル定義 */
  const classes = styles();

  /**
   * 既に登録されているtodoを取得している
   */
  React.useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  }, [needLoad]);

  interface ITodoData {
    docId: string;
    title: string;
    content: string;
    heavy: number;
    limit: Date;
    done: boolean;
  }

  interface ILessonData {
    docId: string;
    title: string;
    classroom: string;
    color: number;
    date: Date;
  }

  interface IScheduleData {
    docId: string;
    title: string;
    classroom: string;
    color: number;
    date: Date;
  }
  /**
   * firestoreに存在しているtodoを取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData(): void {
    setTodoList([]);
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map((doc) => doc.data());
    const schedules = docs.filter((item) => item.uid === props.user);

    const lesson_promise_list = schedules.map((schedule) => {
      return GetLessonsData(Schedule);
    });

    const lessons: ILessonData[] = Promise.all(lesson_promise_list)
      .then((lesson_list) => {
        return lesson_list;
      })
      .catch((err) => console.log(err));

    const todo_promise_list = lessons.map((lesson) => {
      return GetTodosData(schedule, lesson);
    });

    Promise.all(todo_promise_list)
      .then((todo_list) => {
        return setTodoList([...todo_list]);
      })
      .catch((err) => console.log(err));

    /*
    for (let i = 0; i < schedules.length; i++) {
      const subRef = db
        .collection("schedule")
        .doc(schedules[i].docId)
        .collection("lesson");
      const subSnapshots = await subRef.get();
      const lessons = subSnapshots.docs.map((doc) => doc.data());

      for (let j = 0; j < lessons.length; j++) {
        const subsubRef = db
          .collection("schedule")
          .doc(schedules[i].docId)
          .collection("lesson")
          .doc(lessons[j].docId)
          .collection("todo");
        const subsubSnapshots = await subsubRef.get();
        subsubSnapshots.docs.map((doc) => {
          if (!doc.data().done) {
            const tmp = {};
            tmp.todo = doc.data();
            tmp.lesson = lessons[j];
            tmp.schedule = schedules[i];
            result_list.push(tmp);
          }
        });
      }
    }
    setTodoList([...result_list]);
    */
  }

  /**
   * 引数として渡された時間割に所属している授業の情報を取得する
   * @param {Object} schedule - 授業一覧を取得したい時間割
   */
  async function GetLessonsData(schedule: IScheduleData): void {
    const subRef = db
      .collection("schedule")
      .doc(schedule.docId)
      .collection("lesson");
    const subSnapshots = await subRef.get();
    return subSnapshots.docs.map((doc) => doc.data());
  }

  /**
   * 引数として渡された授業に所属しているTodoの情報を取得する
   * @param {Object} schedule - Todoを取得したい授業が所属している時間割
   * @param {Object} lesson - Todoを取得したい授業
   */
  async function GetTodosData(
    schedule: IScheduleData,
    lesson: ILessonData
  ): void {
    const subRef = db
      .collection("schedule")
      .doc(schedule.docId)
      .collection("lesson")
      .doc(lesson.docId)
      .collection("todo");
    const subSnapshots = await subRef.get();
    return subSnapshots.docs.map((doc) => doc.data());
  }

  /**
   * 呼び出されるとtodolistを更新する
   * 具体的にはtodolistを更新するかどうかを管理する状態を変更する
   */
  function handleChange(): void {
    setNeedLoad(!needLoad);
  }

  return (
    <Grid direction="column">
      <Header />
      <Grid item container row alignItems="center" justify="center">
        <Grid item xs={8}>
          <h1 className={classes.TitleText}>Todo</h1>
        </Grid>
        <Grid item xs={4}>
          <CreateTodoDialog handleSubmit={handleChange} user={props.user} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        row
        spacing={10}
        alignItems="center"
        justify="center"
      >
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
            msg="期限順"
          />
        </Grid>
        <Grid item>
          <ShowTodoList
            todoList={[
              ...todoList.sort((a, b) => {
                if (a.todo.heavy > b.todo.heavy) return -1;
                if (a.todo.heavy < b.todo.heavy) return 1;
                return 0;
              }),
            ]}
            handleChange={handleChange}
            user={props.user}
            msg="重さ順"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

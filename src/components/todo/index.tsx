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

interface ITodoData {
  schedule: firebase.firestore.DocumentData;
  lesson: firebase.firestore.DocumentData;
  todo: firebase.firestore.DocumentData;
}

interface ILessonData {
  schedule: firebase.firestore.DocumentData;
  lesson: firebase.firestore.DocumentData;
}

/**
 * todoページを表示する関数
 * @param {Object} props - ユーザーの情報を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 */
export const Todo: React.FC<ITodoProps> = (props) => {
  /** 既に登録されているtodolist */
  const [todoList, setTodoList] = React.useState<ITodoData[]>([]);
  /** todolistを取得しにいくべきかどうか */
  const [needLoad, setNeedLoad] = React.useState<boolean>(true);

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

  /**
   * firestoreに存在しているtodoを取得している
   * 取得した時間割の中で、ログイン中のユーザーが登録した時間割のみ時間割listに追加している
   */
  async function getData(): Promise<void> {
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map((doc) => doc.data());
    const schedules = docs.filter((item) => item.uid === props.user);

    const lesson_promise_list = schedules.map((schedule) => {
      return GetLessonsData(schedule);
    });

    const lessonList: ILessonData[] = [];
    await Promise.all(lesson_promise_list)
      .then((total_list) => {
        return total_list.map((lesson_list) => {
          return lesson_list.map((data) => {
            return lessonList.push(data);
          });
        });
      })
      .catch((err) => console.log(err));

    const todo_promise_list = lessonList.map((data) => {
      return GetTodosData(data.schedule, data.lesson);
    });

    const tmp2: ITodoData[] = [];
    await Promise.all(todo_promise_list)
      .then((total_result) => {
        return total_result.map((result) => {
          return result.map((data) => tmp2.push(data));
        });
      })
      .catch((err) => console.log(err));
    setTodoList([]);
    setTodoList(tmp2);
  }

  /**
   * 引数として渡された時間割に所属している授業の情報を取得する
   * @param {Object} schedule - 授業一覧を取得したい時間割
   */
  async function GetLessonsData(
    schedule: firebase.firestore.DocumentData
  ): Promise<ILessonData[]> {
    const subRef = db
      .collection("schedule")
      .doc(schedule.docId)
      .collection("lesson");
    const subSnapshots = await subRef.get();
    const result_data: ILessonData[] = [];
    subSnapshots.docs.map((doc) => {
      const tmp: ILessonData = { schedule: schedule, lesson: doc.data() };
      return result_data.push(tmp);
    });
    return result_data;
  }

  /**
   * 引数として渡された授業に所属しているTodoの情報を取得する
   * @param {Object} schedule - Todoを取得したい授業が所属している時間割
   * @param {Object} lesson - Todoを取得したい授業
   */
  async function GetTodosData(
    schedule: firebase.firestore.DocumentData,
    lesson: firebase.firestore.DocumentData
  ): Promise<ITodoData[]> {
    const subRef = db
      .collection("schedule")
      .doc(schedule.docId)
      .collection("lesson")
      .doc(lesson.docId)
      .collection("todo");
    const subSnapshots = await subRef.get();
    const return_list: ITodoData[] = [];
    subSnapshots.docs.map((doc) => {
      const obj: ITodoData = {
        schedule: schedule,
        lesson: lesson,
        todo: doc.data(),
      };
      return return_list.push(obj);
    });
    return return_list;
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
      <Grid item container direction="row" alignItems="center" justify="center">
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
        direction="row"
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

import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars";

import firebase, { db } from "../../firebase";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import DeleteButton from "@material-ui/icons/Delete";
import DoneButton from "@material-ui/icons/Done";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  TitleText: {
    "text-align": "center",
    "font-weight": "400",
  },
  ListBlock: {
    "background-color": "#CBCBCB",
    height: "600px",
    width: "500px",
  },
  ListContent: {
    margin: "20px 30px",
  },
  ListContentTextBlock: {
    width: "280px",
    margin: "10px",
  },
  ListContentTextTitle: {
    margin: "0px 0px 30px 10px",
  },
  ListContentTextContent: {
    margin: "0px",
  },
  ListContentButtonBlock: {
    width: "50px",
    margin: "0px",
  },
});

interface ITodoData {
  schedule: firebase.firestore.DocumentData;
  lesson: firebase.firestore.DocumentData;
  todo: firebase.firestore.DocumentData;
}

interface IShowTodoListProps {
  user: string;
  todoList: ITodoData[];
  msg: string;
  handleChange: () => void;
}

/**
 * todoListを表示する関数
 * @param {Object} props - ユーザーやTodoListの情報やTodoListの更新条件を保持している
 * @param {string} props.user - Google認証した際に得られるuseridを保持している
 * @param {Array} props.todoList - Google認証した際に得られるuseridを保持している
 * @param {string} props.msg - 期限順 or 重さ順
 * @param {function} props.handleChange - TodoListを更新する時に呼び出す
 */
export const ShowTodoList: React.FC<IShowTodoListProps> = (props) => {
  /** CSSを用いたスタイル定義 */
  const classes = styles();

  /** Todoの重さを定義している */
  const heavy_list: string[] = [
    "とても軽い",
    "軽い",
    "普通",
    "重い",
    "とても重い",
  ];

  interface IDeleteTodoProps {
    schedule: firebase.firestore.DocumentData;
    lesson: firebase.firestore.DocumentData;
    todo: firebase.firestore.DocumentData;
  }

  /**
   * 削除ボタンがクリックされると発火する
   * クリックされたTodoを削除する
   * @param {object} data - 削除したいtodoなどが格納されている
   * @param {object} data.schedule - 削除したいtodoが登録されている時間割
   * @param {object} data.lesson - 削除したいtodoが登録されている授業
   * @param {object} data.todo - 削除したいtodo
   */
  async function DeleteTodo(data: IDeleteTodoProps): Promise<void> {
    await db
      .collection("schedule")
      .doc(data.schedule.docId)
      .collection("lesson")
      .doc(data.lesson.docId)
      .collection("todo")
      .doc(data.todo.docId)
      .delete();
    props.handleChange();
  }

  interface IDoneTodoProps {
    schedule: firebase.firestore.DocumentData;
    lesson: firebase.firestore.DocumentData;
    todo: firebase.firestore.DocumentData;
  }

  /**
   * 完了ボタンがクリックされると発火する
   * クリックされたTodoを更新する
   * @param {object} data - 更新したいtodoなどが格納されている
   * @param {object} data.schedule - 更新したいtodoが登録されている時間割
   * @param {object} data.lesson - 更新したいtodoが登録されている授業
   * @param {object} data.todo - 更新したいtodo
   */
  async function DoneTodo(data: IDoneTodoProps): Promise<void> {
    await db
      .collection("schedule")
      .doc(data.schedule.docId)
      .collection("lesson")
      .doc(data.lesson.docId)
      .collection("todo")
      .doc(data.todo.docId)
      .update({
        done: true,
      });
    props.handleChange();
  }

  /**
   * 引数の時間を日時に変更する
   * @param {int} secs - 1970年0月1日からの経過時間
   */
  function toDateTime(secs: number): string {
    const t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t.toISOString();
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <h2 className={classes.TitleText}>{props.msg}</h2>
      </Grid>
      <Grid
        item
        alignItems="center"
        justify="center"
        className={classes.ListBlock}
      >
        <Scrollbars>
          {props.todoList.map((item) => (
            <Paper elevation={3} className={classes.ListContent}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <Grid container direction="row">
                      <Grid item className={classes.ListContentTextBlock}>
                        <h2 className={classes.ListContentTextTitle}>
                          {item.todo.title}
                        </h2>
                        <p className={classes.ListContentTextContent}>
                          重さ: {heavy_list[item.todo.heavy]}
                        </p>
                        <p className={classes.ListContentTextContent}>
                          {toDateTime(item.todo.limit.seconds)}
                        </p>
                      </Grid>
                      <Grid
                        item
                        container
                        direction="column"
                        className={classes.ListContentButtonBlock}
                      >
                        <Grid item>
                          <Button onClick={() => DoneTodo(item)}>
                            <DoneButton />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button onClick={() => DeleteTodo(item)}>
                            <DeleteButton />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item>
                    <p className={classes.ListContentTextContent}>
                      {item.todo.content}
                    </p>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))}
        </Scrollbars>
      </Grid>
    </Grid>
  );
};

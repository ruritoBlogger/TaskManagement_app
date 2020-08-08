import * as React from "react";
import { useForm, Controller } from "react-hook-form";

import firebase, { db } from "../../firebase";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  button: {
    padding: "7px 40px",
    margin: "30px",
    color: "#FFFFFF",
    background: "#EDC124",
    "text-align": "center",
    "font-size": "15px",
  },
  Content: {
    "min-width": "100px",
  },
  SubmitButton: {
    color: "#FFFFFF",
    background: "#EDC124",
  },
});

interface ICreateTodoDialogProps {
  handleSubmit: () => void;
  user: string;
}

/**
 * 新しくtodoを登録するダイアログを表示する関数
 * @param {Object} props - todoを更新するイベントやユーザーデータを管理
 * @param {function} props.handleSubmit - 呼び出すと授業listを取得し直す
 * @param {string} props.user - user_id
 */
export const CreateTodoDialog: React.FC<ICreateTodoDialogProps> = (props) => {
  /** ダイアログが開かれているかどうかの状態 */
  const [open, setOpen] = React.useState<boolean>(false);

  /** firestoreから持ってきた授業データを管理する */
  const [lessons, setLessons] = React.useState<
    firebase.firestore.DocumentData[]
  >([]);

  /** firestoreから持ってきた時間割データ */
  const [schedules, setSchedules] = React.useState<
    firebase.firestore.DocumentData[]
  >([]);

  /** dialogの課題の重さの状態 */
  const [heavy, setHeavy] = React.useState<number>(0);

  /** 選択された時間割 */
  const [schedule, setSchedule] = React.useState<number>(-1);

  /** 選択された授業 */
  const [lesson, setLesson] = React.useState<number>(-1);
  /** 選択された日時 */
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  /** react hook formで用意された変数群 */
  const { register, handleSubmit, control, errors } = useForm();

  /** Todoの重さを定義している */
  const heavy_list = ["とても軽い", "軽い", "普通", "重い", "とても重い"];

  /** CSSを用いたスタイル定義 */
  const classes = styles();

  /**
   * firestoreに存在する色データを取得している
   */
  React.useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  }, [open]);

  /**
   * firestoreに存在している授業データを取得している
   */

  React.useEffect(() => {
    const data = async () => {
      await getLessonData();
    };
    data();
  }, [schedule]);

  /**
   * firestoreに存在している時間割データを取得している
   * ダイアログが開いた時に取得するようにしている
   */
  async function getData(): Promise<void> {
    const colRef = db.collection("schedule");
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map((doc) => doc.data());
    const schedules = docs.filter((item) => item.uid === props.user);
    setSchedules(schedules);
  }

  async function getLessonData(): Promise<void> {
    if (schedule !== -1 && schedules[schedule].docId !== undefined) {
      console.log("test");
      const otherRef = db
        .collection("schedule")
        .doc(schedules[schedule].docId)
        .collection("lesson");
      const lesson_snapshots = await otherRef.get();
      const lesson_docs = lesson_snapshots.docs.map((doc) => doc.data());
      setLessons(lesson_docs);
    }
  }

  /**
   * ダイアログを表示するかどうかを管理するボタンがクリックされた時に発火する
   * ダイアログを表示する
   */
  function handleOpen(): void {
    setOpen(true);
  }

  /**
   * ダイアログを表示している時に中止ボタンがクリックされた時に発火する
   * ダイアログを閉じる
   */
  function handleClose(): void {
    setOpen(false);
  }

  /**
   * ダイアログを表示している時に重さ選択部分で状態が変化発火する
   * 選択された重さを状態に登録する
   */
  function handleHeavyChange(event: any): void {
    setHeavy(event.target.value);
  }

  /**
   * ダイアログを表示している時に時間割選択部分で状態が変化発火する
   * 選択された時間割を状態に登録する
   */
  function handleScheduleChange(event: any): void {
    setSchedule(event.target.value);
  }

  /**
   * ダイアログを表示している時に授業選択部分で状態が変化発火する
   * 選択された授業を状態に登録する
   */
  function handleLessonChange(event: any): void {
    setLesson(event.target.value);
  }

  /**
   * 期限の入力が行われた時発火する
   */
  function handleDateChange(date: Date): void {
    setSelectedDate(date);
  }

  interface ISubmitProps {
    title: string;
    content: string;
  }

  /**
   * ダイアログを表示している時に登録ボタンがクリックされた時に発火する
   * 入力された情報を元に授業を追加してダイアログを閉じる
   *
   * @param {Object} value - 入力された情報を保持している
   * @param {string} value.title - 時間割のタイトル
   * @param {string} value.content - todoの内容
   */
  function Submit(value: ISubmitProps): void {
    if (
      value.title &&
      value.content &&
      schedule !== -1 &&
      schedules[schedule].docId !== undefined &&
      lesson !== -1 &&
      lessons[lesson].docId !== undefined
    ) {
      const docId = db
        .collection("schedule")
        .doc(schedules[schedule].docId)
        .collection("lesson")
        .doc(lessons[lesson].docId)
        .collection("todo")
        .doc().id;

      db.collection("schedule")
        .doc(schedules[schedule].docId)
        .collection("lesson")
        .doc(lessons[lesson].docId)
        .collection("todo")
        .doc(docId)
        .set({
          docId: docId,
          title: value.title,
          content: value.content,
          heavy: heavy,
          limit: selectedDate,
          done: false,
        });
      props.handleSubmit();
      handleClose();
    }
  }

  return (
    <div>
      <Button onClick={handleOpen} className={classes.button}>
        追加
      </Button>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"xs"}
        onClose={handleClose}
        aria-labelledby="common-dialog-title"
        aria-describedby="common-dialog-description"
      >
        <DialogTitle>Todoを追加する</DialogTitle>
        <form onSubmit={handleSubmit(Submit)}>
          <DialogContent>
            <Grid direction="column">
              <Grid className={classes.Content}>
                <TextField
                  name="title"
                  label="Todo名"
                  defaultValue="進捗"
                  inputRef={register}
                />
              </Grid>
              <Grid className={classes.Content}>
                <TextField
                  name="content"
                  label="内容"
                  defaultValue="進捗出して、どうぞ"
                  inputRef={register}
                />
              </Grid>
              <Grid className={classes.Content}>
                <FormControl className={classes.Content}>
                  <InputLabel id="heavy-label">課題の重さ</InputLabel>
                  <Select
                    labelId="heavy-label"
                    value={heavy}
                    onChange={handleHeavyChange}
                  >
                    {(() => {
                      const return_list = [];
                      for (let i = 0; i < heavy_list.length; i++) {
                        return_list.push(
                          <MenuItem value={i}>{heavy_list[i]}</MenuItem>
                        );
                      }
                      return return_list;
                    })()}
                  </Select>
                </FormControl>
              </Grid>
              <Grid className={classes.Content}>
                <FormControl className={classes.Content}>
                  <InputLabel id="schedule-label">対応時間割</InputLabel>
                  <Select
                    labelId="schedule-label"
                    value={schedule}
                    onChange={handleScheduleChange}
                  >
                    {(() => {
                      const return_list = [];
                      for (let i = 0; i < schedules.length; i++) {
                        return_list.push(
                          <MenuItem value={i}>{schedules[i].title}</MenuItem>
                        );
                      }
                      return return_list;
                    })()}
                  </Select>
                </FormControl>
              </Grid>
              <Grid className={classes.Content}>
                <FormControl className={classes.Content}>
                  <InputLabel id="lesson-label">対応授業</InputLabel>
                  <Select
                    labelId="lesson-label"
                    value={lesson}
                    onChange={handleLessonChange}
                  >
                    {(() => {
                      const return_list = [];
                      for (let i = 0; i < lessons.length; i++) {
                        return_list.push(
                          <MenuItem value={i}>{lessons[i].title}</MenuItem>
                        );
                      }
                      return return_list;
                    })()}
                  </Select>
                </FormControl>
              </Grid>
              <Grid className={classes.Content}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="締め切り"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>中止</Button>
            <Button type="submit" className={classes.SubmitButton}>
              登録
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

import React, { useState, useEffect } from "react";

import CreateLessonDialog from "./CreateLessonDialog";
import EditLessonDialog from "./EditLessonDialog";
import DeleteDialog from "../deleteDialog";
import firebase, { db } from "../../firebase";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import * as React from "react";

/** CSSを用いたスタイル定義 */
const styles = makeStyles({
  DayBlock: {
    margin: "0px",
  },
  GuideBlock: {
    height: "50px",
    margin: "0px 1px 5px 1px",
  },
  GuideBlockText: {
    "text-align": "center",
    margin: "0px 5px",
    "padding-top": "13px",
  },
  LessonBlock: {
    width: "119px",
    height: "50px",
    margin: "0px 1px 5px 1px",
  },
  LessonBlockText: {
    margin: "0px",
    "text-align": "center",
    overflow: "hidden",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
  },
});

interface IScheduleData {
  docId: string;
  uid: string;
  title: string;
  is_default: boolean;
}

interface IShowScheduleProps {
  schedule: IScheduleData;
  needLoad: boolean;
}

/**
 * 時間割の内容を表示する関数
 * @param {Object} props - 表示したい時間割などが格納されている
 * @param {list} props.schedule - 表示したい時間割
 * @param {boolean} props.needLoad - メイン時間割を更新するflag
 */
export const ShowSchedule: React.FC<IShowScheduleProps> = props => {
  /** 時間割に登録されている授業list */
  const [lessonList, setLessonList] = useState([]);

  /** 授業listを更新するかどうかの状態 */
  const [needLoad, setNeedLoad] = useState(false);

  /** 時間割の時間部分 */
  const TimeList = [
    "   ",
    "1限目",
    "2限目",
    "3限目",
    "4限目",
    "5限目",
    "6限目",
  ];

  /** 時間割の曜日部分 */
  const DayList = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];

  /** CSSを用いたスタイル定義 */
  const classes = styles();

  /**
   * firestoreに存在する色データを取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData();
    };
    data();
  }, [needLoad || props]);

  /**
   * firestoreに存在している色データを取得している
   * ダイアログが開いた時に取得するようにしている
   */
  async function getData(): void {
    let colRef = db.collection("lesson");
    if (props.schedule) {
      colRef = db
        .collection("schedule")
        .doc(props.schedule.docId)
        .collection("lesson");
    }
    const snapshots = await colRef.get();
    const docs = snapshots.docs.map((doc) => doc.data());

    const tmp_list = new Array(30).fill(null);
    for (let i = 0; i < 30; i++) {
      let tmp_lesson = {};
      tmp_lesson.title = "   ";
      tmp_lesson.classroom = "   ";
      tmp_lesson.color = "#FFFFFF";
      tmp_lesson.date = i;
      tmp_lesson.docId = -1;
      tmp_list[i] = tmp_lesson;
    }

    docs.map((item) => (tmp_list[item.date] = item));
    const return_list = [...tmp_list];
    setLessonList(return_list);
  }

  /**
   * 呼び出されると授業listを更新する
   * 具体的には授業listを更新するかどうかを管理する状態を変更する
   */
  async function handleChange(): void {
    await getData();
  }

  return (
    <Grid>
      <Grid container>
        {(() => {
          if (lessonList[29]) {
            let result_data = [];
            let guide_data = [];
            for (let i = 0; i < 7; i++) {
              guide_data.push(
                <Paper elevation={1} className={classes.GuideBlock}>
                  <p className={classes.GuideBlockText}>{TimeList[i]}</p>
                </Paper>
              );
            }
            result_data.push(
              <Grid item direction="column" className={classes.DayBlock}>
                {guide_data}
              </Grid>
            );
            for (let i = 0; i < 5; i++) {
              let day_data = [];
              day_data.push(
                <Paper elevation={3} className={classes.LessonBlock}>
                  <p className={classes.GuideBlockText}>{DayList[i]}</p>
                </Paper>
              );
              for (let j = 0; j < 6; j++) {
                if (lessonList[i * 6 + j].docId === -1) {
                  day_data.push(
                    <Paper elevation={3} className={classes.LessonBlock}>
                      <CreateLessonDialog
                        schedule={props.schedule}
                        date={i * 6 + j}
                        handleSubmit={handleChange}
                      />
                    </Paper>
                  );
                } else {
                  day_data.push(
                    <Paper elevation={3} className={classes.LessonBlock}>
                      <EditLessonDialog
                        schedule_docId={props.schedule.docId}
                        lesson={lessonList[i * 6 + j]}
                        handleSubmit={handleChange}
                      />
                    </Paper>
                  );
                }
              }
              result_data.push(
                <Grid item direction="column" className={classes.DayBlock}>
                  {day_data}
                </Grid>
              );
            }
            return result_data;
          }
        })()}
      </Grid>
    </Grid>
  );
}

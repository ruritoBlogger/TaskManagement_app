import React, { useState, useEffect } from "react"

import LessonDialog from "./LessonDialog"
import DeleteDialog from "../deleteDialog"
import firebase, { db } from "../../firebase"

import Grid from "@material-ui/core/Grid"

/**
 * 時間割の内容を表示する関数
 * @param {Object} props - 表示したい時間割などが格納されている
 * @param {list} props.schedule - 表示したい時間割
 */

export default function ShowSchedule(props) {

  /** 時間割に登録されている授業list */
  const [lessonList, setLessonList] = useState([])

  /** 授業listを更新するかどうかの状態 */
  const [needLoad, setNeedLoad] = useState(false)

  /**
   * firestoreに存在する色データを取得している
   */
  useEffect(() => {
    const data = async () => {
      await getData()
    }
    data()
  }, [needLoad || props])

  /**
   * firestoreに存在している色データを取得している
   * ダイアログが開いた時に取得するようにしている
   */
  async function getData() {
    let colRef = db.collection("lesson")
    if( props.schedule ) {
      colRef = db.collection("schedule").doc(props.schedule.docId).collection("lesson")
    }
    const snapshots = await colRef.get()
    const docs = snapshots.docs.map(doc => doc.data())
    setLessonList(docs)
    console.log(docs)
  }

  /**
   * 呼び出されると授業listを更新する
   * 具体的には授業listを更新するかどうかを管理する状態を変更する
   */
  function handleChange() {
    //setNeedLoad(!needLoad)
  }

  return (
    <div>
      {
        lessonList.map(item => (
          <div>
            <h4>{item.title}</h4>
            <p>{item.classroom}</p>
          </div>
        ))
      }
      <LessonDialog schedule={props.schedule} handleSubmit={handleChange} />
    </div>
  )
}
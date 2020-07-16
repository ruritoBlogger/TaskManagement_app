import React from "react"

/**
 * 時間割の内容を表示する関数
 * @param {Object} props - 表示したい時間割などが格納されている
 * @param {list} props.schedule - 表示したい時間割
 */

export default function ShowSchedule(props) {
  return (
    <div>
      {
        (() => {
          if (props.schedule) {
            return(<p>{props.schedule.title}</p>)
          } else {
            return(<p>読み込めてない</p>)
          }
        })()
      }
    </div>
  )
}
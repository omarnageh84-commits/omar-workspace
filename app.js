// app.js - النسخة الكاملة - Firebase ياخد كل حاجة
import { saveData } from "./firebase.js";
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzh_9Ob76032uBa-0WqRopMVvZ5nEfwiJ7cE9wSQ8JItDnmGezp40OC23L0oDwlHJetjg/exec";

function sendToSheet(tabName, rowArray){
  try{
    fetch(SHEET_API_URL, {method:"POST", mode:"no-cors", body:JSON.stringify({tab:tabName, values:rowArray})});
  }catch(e){}
}
export function saveDailyToFirebase(tx){
  saveData("daily", tx.id, tx);
  sendToSheet("اليومية - Daily", [tx.date, tx.type, tx.item, tx.amount, tx.wallet, tx.note||"", Date.now()]);
}
export function saveAttendance(inTime, outTime){
  const date = new Date().toISOString().split('T')[0];
  const row = {date, inTime, outTime, hours: "", status:"حاضر", ts:Date.now()};
  saveData("attendance", date, row);
  sendToSheet("الحضور والانصراف - Attendance", [date, inTime, outTime, "", "حاضر", "", Date.now()]);
  return row;
}
export function saveTaskToFirebase(task){
  saveData("tasks", task.id, task);
}
export async function deleteTaskFromFirebase(id){
  const {deleteData} = await import("./firebase.js");
  deleteData("tasks", id);
}
export function showToast(msg){
  let t=document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; t.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:12px;z-index:9999;background:#10b981;color:white;font-family:Tajawal;transition:0.3s'; document.body.appendChild(t); }
  t.textContent=msg; t.style.opacity='1'; setTimeout(()=>t.style.opacity='0',2500);
}

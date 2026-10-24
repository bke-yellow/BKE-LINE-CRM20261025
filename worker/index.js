const ORIGIN = "https://bke-yellow.github.io";
const SYSTEM = "你是台灣保健食品 OEM/ODM 營業管理助理。請依 LINE 對話產生繁體中文、可追溯的客戶進度摘要。嚴格規則：只用提供的原始訊息，不可推測報價、訂單、交貨、已完成或交期。客戶詢價不是正式報價，表示要下單不等於訂單成立。每筆判斷用 evidence_ids 指向訊息 id。區分需求、決議、已完成、未完成、待處理、處理中、報價線索、訂單交貨線索與下一步行動。資料不足輸出空陣列。輸出 JSON：{\"overview\":\"總摘要\",\"needs\":[{\"text\":\"需求\",\"evidence_ids\":[\"...\"]}],\"decisions\":[{\"text\":\"決議\",\"evidence_ids\":[\"...\"]}],\"completed\":[{\"text\":\"完成\",\"evidence_ids\":[\"...\"]}],\"unfinished\":[{\"text\":\"未完成\",\"evidence_ids\":[\"...\"]}],\"todo\":[{\"text\":\"待辦\",\"evidence_ids\":[\"...\"],\"priority\":\"P2\",\"due_date\":null}],\"in_progress\":[{\"text\":\"處理中\",\"evidence_ids\":[\"...\"]}],\"quotes\":[{\"text\":\"報價\",\"is_confirmed\":false,\"evidence_ids\":[\"...\"]}],\"orders\":[{\"text\":\"訂單交貨\",\"is_confirmed\":false,\"evidence_ids\":[\"...\"]}],\"next_actions\":[{\"text\":\"下一步\",\"evidence_ids\":[\"...\"],\"priority\":\"P2\",\"due_date\":null}]}";
export default {
 async fetch(req,env){
   const headers={"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, X-BKE-Access-Token","Vary":"Origin","Cache-Control":"no-store","Content-Type":"application/json; charset=utf-8"};
   const answer=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
   if(req.headers.get("Origin")!==ORIGIN)return answer({error:"Origin 未授權"},403);
   if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
   if(req.method!=="POST")return answer({error:"Method Not Allowed"},405);
   if(!env.OPENAI_API_KEY||!env.BKE_ACCESS_TOKEN)return answer({error:"後端尚未設定 API 金鑰或存取密碼"},503);
   const token=req.headers.get("X-BKE-Access-Token")||"";
   const hash=async s=>new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)));
   const [a,b]=await Promise.all([hash(token),hash(env.BKE_ACCESS_TOKEN)]);
   let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];
   if(diff||!token)return answer({error:"存取密碼錯誤"},401);
   if(Number(req.headers.get("Content-Length")||0)>220000)return answer({error:"資料超過單次分析上限"},413);
   let data;try{data=await req.json()}catch{return answer({error:"JSON 格式錯誤"},400)}
   if(!data||typeof data.customer!=="string"||!Array.isArray(data.messages))return answer({error:"缺少客戶或訊息"},400);
   if(data.messages.length<1||data.messages.length>200)return answer({error:"每次分析訊息數必須為 1–200"},400);
   const messages=data.messages.map(x=>({id:String(x.id||"").slice(0,80),date:String(x.date||"").slice(0,40),speaker:String(x.speaker||"").slice(0,80),text:String(x.text||"").slice(0,1200)}));
   if(JSON.stringify(messages).length>110000)return answer({error:"訊息內容過長，請縮小日期區間"},413);
   const payload={model:"gpt-4.1-mini",temperature:0.1,response_format:{type:"json_object"},messages:[{role:"system",content:SYSTEM},{role:"user",content:JSON.stringify({customer:data.customer,range:data.range||"",messages})}]};
   let upstream;try{upstream=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(payload)})}catch{return answer({error:"AI 服務連線失敗"},502)}
   if(!upstream.ok)return answer({error:"AI 分析失敗，HTTP "+upstream.status},502);
   try{const raw=await upstream.json(),result=JSON.parse(raw.choices[0].message.content);return answer({result,model:raw.model,message_count:messages.length})}catch{return answer({error:"AI 回傳格式不正確，請重新嘗試"},502)}
 }
};
const NOTION_TOKEN = "XXXXXXXXXXXXXXXXX";
const DATABASE_ID = "XXXXXXXXXXXXXXXXX";
const CALENDAR_ID = "XXXXXXXXXXXXXXXXX";

function syncNotionToGoogleCalendar() {
  const notionEvents = fetchNotionEvents();
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    Logger.log(`カレンダーID「${CALENDAR_ID}」が見つかりませんでした。`);
  } else {
    Logger.log(`カレンダー名: ${calendar.getName()}`);
  }

  notionEvents.forEach(event => {
    const start = new Date(event.start);
    if (event.end != "なし"){
      const end = new Date(event.end);
      const existingEvent = calendar.getEvents(start, end).find(e => e.getTitle() === event.title);
        if (!existingEvent) {
          calendar.createEvent(event.title, start, end, {
            description: "不在",
            visibility: CalendarApp.Visibility.PRIVATE,
            transparency: "busy"  
          });
        }
    }
  });
}

function fetchNotionEvents() {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  // 今日と1週間前のDateオブジェクトを用意
  const today   = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // date が null のページを除外してから map
  return data.results
    .filter(page => {
      const d = page.properties["開始"].date;
      // 日付プロパティがない or start がない → 除外
      if (!d || !d.start) {
        return false;
      }

      const startDate = new Date(d.start);
      // もし開始日が1週間以上前なら除外
      if (startDate < weekAgo) {
        Logger.log(`ページ ${page.id} は1週間以上前の (${d.start}) のためスキップ`);
        return false;
      }

      return true;  // それ以外はマッピング対象
    })
    .map(page => {
      const title = "不在";
      const dateProp  = page.properties["開始"].date;
      const start = new Date(dateProp.start);
      const end =  page.properties["開始"].date.end || "なし" 
      return { title, start, end };
    });
}

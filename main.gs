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
  //Logger.log(notionEvents);

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
  
  return data.results.map(page => ({
    title: "不在",
    start: page.properties["開始"].date.start,
    end: page.properties["開始"].date.end || "なし"  // 終了がない場合
  }));
}


import { differenceInDays } from "date-fns";

export function generateItinerary(city, startDate, endDate, cityActivities) {
  const activities = cityActivities[city] || [];
  const days = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  const items = [];

  for (let day = 1; day <= days; day++) {
    const dailyActivities = activities.slice((day - 1) * 3, day * 3);
    dailyActivities.forEach((activity, index) => {
      items.push({
        id: Date.now() + items.length,
        day,
        time: `${10 + index * 2}:00`,
        activity,
      });
    });
  }

  return items;
}

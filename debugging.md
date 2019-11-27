# from yearly
5 + 5 + 132 + 122 + 4700 + 3632 + 1905 + 1666 + 10018 + 9676 + 15481 + 16050 + 5775 + 5802 + 24546 + 29973 + 32871 + 40016 + 15307 + 19109 + 4065 + 4855 =

# from monthly
12442 + 8667 + 7269 + 6476 + 11434 + 9094 + 6004 + 11179 + 10500 + 11807 + 9011 + 10927 + 14897 + 10034 + 8082 + 7725 + 12229 + 9814 + 6533 + 13182 + 11193 + 13747 + 10430 + 13046 = 

# from weekly
16759 + 16620 + 17255 + 16155 + 16708 + 15402 + 15911 + 19353 + 19124 + 19164 + 18454 + 18832 + 18157 + 17828 = 


# debugging
```
{name: "Stoyan Shukerov", groupChatThreads: Array(59), regThreads: {…}, numPictures: {…}, days_msged: {…}, …}

temp1.timeStats.weekly
{sent: Array(8), received: Array(7)}received: (7) [15707, 16113, 16732, 15554, 16003, 14807, 15042]sent: (8) [18620, 18925, 18992, 18183, 18490, 17789, 17151, 0]__proto__: Object

received_weekly = temp1.timeStats.weekly.received.reduce((acc, dp) => { return acc += dp }, 0);
sent_weekly = temp1.timeStats.weekly.sent.reduce((acc, dp) => { return acc += dp }, 0);
sent_weekly + received_weekly
> 235328

received_monthly = temp1.timeStats.monthly.received.reduce((acc, dp) => { return acc += dp }, 0);
sent_monthly = temp1.timeStats.monthly.sent.reduce((acc, dp) => { return acc += dp }, 0);
sent_monthly + received_monthly
> 235328

sent_hourly = temp1.timeStats.hourly.sent.reduce((acc, dp) => { return acc += dp }, 0);
received_hourly = temp1.timeStats.hourly.received.reduce((acc, dp) => { return acc += dp }, 0);
sent_hourly + received_hourly
> 235328

let sum = 0;
let msgCumulative = Object.keys(temp1.timeStats.yearly).reduce((acc, dp) => {
    sum += temp1.timeStats.yearly[dp].sent + temp1.timeStats.yearly[dp].received;
    acc[dp] = sum;
    return acc;
  }, {});
> {2009: 10, 2010: 263, 2011: 8580, 2012: 12122, 2013: 31188, 2014: 60882, 2015: 70883, 2016: 122222, 2017: 192769, 2018: 224606, 2019: 235317}

sent_total = 0
Object.keys(temp1.regThreads).forEach((key) => {
  sent_total += temp1.regThreads[key].msgByUser;
});
> 125952

received_total = 0
Object.keys(temp1.regThreads).forEach((key) => {
  received_total += temp1.regThreads[key].other;
});
> 108352

sent_total + received_total
>

```

var pageIndex = 1;

    let options = {
        root:null,
        rootMargins:'2px',
        threshold:0.5
    };
    const observer = new IntersectionObserver(handleintersect,options);
    observer.observe(document.getElementById('footer'));
    


function handleintersect(entries){
    if(entries[0].isIntersecting){
        GetData(pageIndex);
    }
}

function GetData(pageindex){
    fetch('https://api.github.com/search/repositories?q=created:>2017-10-22&sort=stars&order=desc&page='+pageindex)
    .then(res => res.json())
    .then(data =>{
        data.items.forEach(item =>{
            let img = item.owner.avatar_url;
            let repo_name = item.name;
            let description = item.description;
            if(description === null){
                description = 'No description';
            }
            let repo_url = item.html_url;
            let stars =  abbrNum(item.stargazers_count,0);
            let Issues =  abbrNum(item.open_issues_count,0);
            let user_name = item.owner.login;
            let user_url = item.owner.html_url;
            let created_at = new Date(item.created_at);
            let time_created = timeAgo(created_at);
            
            let compo = `
            <div class="w-2/3 border p-4 rounded-lg bg-white shadow flex flex-col items-center lg:items-start lg:flex-row gap-4">
                <div class="w-32 h-32 overflow-hidden bg-center bg-cover rounded-lg flex-none shadow" style="background-image: url(${img});"></div>
                <div class="w-full flex flex-1 min-w-0 flex-col gap-2">
                    <a href="${repo_url}" target="_black" class="text-xl font-bold">${repo_name}</a>
                    <p class="text-sm w-full truncate" >${description}</p>
                    <div class="w-full flex items-center gap-2 mt-2 flex-col lg:flex-row">
                        <div class="flex flex-none gap-1 flex-col md:flex-row">
                            <span class="p-1 px-2 border rounded shadow-sm">Stars: ${stars}</span>
                            <span class="p-1 px-2 border rounded shadow-sm">Issues: ${Issues}</span>
                        </div>
                        <p class="p-1 text-sm">Submitted ${time_created} by <a href="${user_url}" target="_blank" class="underline cursor-pointer">${user_name}</a></p>
                    </div>
                </div>
            </div>
            `
            $('#main').append(compo);
        })
    })
    pageIndex = pageIndex +1;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}

function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
  
    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${ minutes }`;
    }
  
    if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${ prefomattedDate } at ${ hours }:${ minutes }`;
    }
  
    if (hideYear) {
      // 10. January at 10:20
      return `${ day }. ${ month } at ${ hours }:${ minutes }`;
    }
  
    // 10. January 2017. at 10:20
    return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
  }
  
  
  // --- Main function
  function timeAgo(dateParam) {
    if (!dateParam) {
      return null;
    }
  
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
  
  
    if (seconds < 5) {
      return 'now';
    } else if (seconds < 60) {
      return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
      return 'about a minute ago';
    } else if (minutes < 60) {
      return `${ minutes } minutes ago`;
    } else if (isToday) {
      return getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
      return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
      return getFormattedDate(date, false, true); // 10. January at 10:20
    }
  
    return getFormattedDate(date); // 10. January 2017. at 10:20
  }
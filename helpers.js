module.exports = {
  periods: [
    {
      name: 'Pre-Season 1',
      date: 'June 2019',
      timelines: ['1920', '1953', '1986', '2019', '2052'],
      min: "1986",
      max: "2052",
      emin: "2019",
      emax: "2019",
      dates: [
        {
          date: 'June 20th',
          episode: 'S2E6',
        },
        {
          date: 'June 21st',
          episode: 'S1E1',
        },
        { date: '' },
        { date: 'October 9th' },
        { date: 'October 22nd' },
      ],
    },
    {
      name: 'Season 1',
      date: 'November 2019',
      timelines: ['1920', '1953', '1986', '2019', '2052'],
      min: "1953",
      max: "2052",
      emin: "1953",
      emax: "2019",
      dates: [
        {
          date: 'November 4th',
          episode: 'S1E1',
        },
        {
          date: 'November 5th',
          episode: 'S1E2, S1E3',
        },
        {
          date: 'November 6th',
          episode: 'S1E4',
        },
        {
          date: 'November 7th',
          episode: 'S1E5',
        },
        {
          date: 'November 8th',
          episode: 'S1E6',
        },
        {
          date: 'November 9th',
          episode: 'S1E7',
        },
        {
          date: 'November 10th',
          episode: 'S1E8',
        },
        {
          date: 'November 11th',
          episode: 'S1E9',
        },
        {
          date: 'November 12th',
          episode: 'S1E10',
        },
      ],
    },
    {
      name: 'Season 2',
      date: 'June 2020',
      timelines: ['1921', '1954', '1987', '2020', '2053'],
      min: "1921",
      max: "2053",
      dates: [
        {
          date: 'June 21st',
          episode: 'S2E1',
        },
        {
          date: 'June 22nd',
          episode: 'S2E2',
        },
        {
          date: 'June 23rd',
          episode: 'S2E3, S2E4',
        },
        {
          date: 'June 24th',
          episode: 'S2E4',
        },
        {
          date: 'June 25th',
          episode: 'S2E5',
        },
        {
          date: 'June 26th',
          episode: 'S2E7',
        },
        {
          date: 'June 27th',
          episode: 'S2E8',
        },
      ],
    },
    {
      name: 'Season 3',
      date: 'June 2020',
      timelines: ['1920', '1953', '1986', '2019', '2052'],
      dates: [
      ],
    },

  ],

  characterSort: function (a, b){
    const ages={
      "Young":0,
      "1 yr older":1,
      "Adult":2,
      "Old":3
    }
    
    let nameA = a.shortName.toUpperCase(); // ignore upper and lowercase
    let nameB = b.shortName.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    if(ages[a.age] < ages[b.age]){
      return -1;
    }
    if(ages[a.age] > ages[b.age]){
      return 1;
    }
    return 0;
  },

  formatName(character, long){
    let formattedAge = ''
    if(character.age){
      formattedAge = ` (${character.age})`;
    }
    if(long){
      return(character.name+formattedAge)
    }
    else{
      return(character.shortName+formattedAge)
    }
  }

};

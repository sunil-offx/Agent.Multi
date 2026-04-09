export interface PollingStation {
  number: number;
  name: string;
  location: string;
}

export interface Constituency {
  name: string;
  pollingStations: PollingStation[];
}

export interface District {
  name: string;
  constituencies: Constituency[];
}

export interface State {
  name: string;
  districts: District[];
}

export const states: State[] = [
  {
    name: "Tamil Nadu",
    districts: [
      {
        name: "Ariyalur",
        constituencies: [
          {
            name: "Ariyalur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Ariyalur", location: "Main Road, Ariyalur" },
              { number: 102, name: "Panchayat Union School, Ariyalur", location: "Market Street, Ariyalur" },
              { number: 103, name: "Community Hall, Ariyalur", location: "Station Road, Ariyalur" },
            ]
          },
          {
            name: "Ariyalur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Ariyalur", location: "Main Road, Ariyalur" },
              { number: 102, name: "Panchayat Union School, Ariyalur", location: "Market Street, Ariyalur" },
              { number: 103, name: "Community Hall, Ariyalur", location: "Station Road, Ariyalur" },
            ]
          },
        ]
      },
      {
        name: "Chengalpattu",
        constituencies: [
          {
            name: "Chengalpattu North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Chengalpattu", location: "Main Road, Chengalpattu" },
              { number: 102, name: "Panchayat Union School, Chengalpattu", location: "Market Street, Chengalpattu" },
              { number: 103, name: "Community Hall, Chengalpattu", location: "Station Road, Chengalpattu" },
            ]
          },
          {
            name: "Chengalpattu South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Chengalpattu", location: "Main Road, Chengalpattu" },
              { number: 102, name: "Panchayat Union School, Chengalpattu", location: "Market Street, Chengalpattu" },
              { number: 103, name: "Community Hall, Chengalpattu", location: "Station Road, Chengalpattu" },
            ]
          },
        ]
      },
      {
        name: "Chennai",
        constituencies: [
          {
            name: "Chennai North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Chennai", location: "Main Road, Chennai" },
              { number: 102, name: "Panchayat Union School, Chennai", location: "Market Street, Chennai" },
              { number: 103, name: "Community Hall, Chennai", location: "Station Road, Chennai" },
            ]
          },
          {
            name: "Chennai South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Chennai", location: "Main Road, Chennai" },
              { number: 102, name: "Panchayat Union School, Chennai", location: "Market Street, Chennai" },
              { number: 103, name: "Community Hall, Chennai", location: "Station Road, Chennai" },
            ]
          },
        ]
      },
      {
        name: "Coimbatore",
        constituencies: [
          {
            name: "Coimbatore North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Coimbatore", location: "Main Road, Coimbatore" },
              { number: 102, name: "Panchayat Union School, Coimbatore", location: "Market Street, Coimbatore" },
              { number: 103, name: "Community Hall, Coimbatore", location: "Station Road, Coimbatore" },
            ]
          },
          {
            name: "Coimbatore South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Coimbatore", location: "Main Road, Coimbatore" },
              { number: 102, name: "Panchayat Union School, Coimbatore", location: "Market Street, Coimbatore" },
              { number: 103, name: "Community Hall, Coimbatore", location: "Station Road, Coimbatore" },
            ]
          },
        ]
      },
      {
        name: "Cuddalore",
        constituencies: [
          {
            name: "Cuddalore North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Cuddalore", location: "Main Road, Cuddalore" },
              { number: 102, name: "Panchayat Union School, Cuddalore", location: "Market Street, Cuddalore" },
              { number: 103, name: "Community Hall, Cuddalore", location: "Station Road, Cuddalore" },
            ]
          },
          {
            name: "Cuddalore South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Cuddalore", location: "Main Road, Cuddalore" },
              { number: 102, name: "Panchayat Union School, Cuddalore", location: "Market Street, Cuddalore" },
              { number: 103, name: "Community Hall, Cuddalore", location: "Station Road, Cuddalore" },
            ]
          },
        ]
      },
      {
        name: "Dharmapuri",
        constituencies: [
          {
            name: "Dharmapuri North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Dharmapuri", location: "Main Road, Dharmapuri" },
              { number: 102, name: "Panchayat Union School, Dharmapuri", location: "Market Street, Dharmapuri" },
              { number: 103, name: "Community Hall, Dharmapuri", location: "Station Road, Dharmapuri" },
            ]
          },
          {
            name: "Dharmapuri South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Dharmapuri", location: "Main Road, Dharmapuri" },
              { number: 102, name: "Panchayat Union School, Dharmapuri", location: "Market Street, Dharmapuri" },
              { number: 103, name: "Community Hall, Dharmapuri", location: "Station Road, Dharmapuri" },
            ]
          },
        ]
      },
      {
        name: "Dindigul",
        constituencies: [
          {
            name: "Dindigul North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Dindigul", location: "Main Road, Dindigul" },
              { number: 102, name: "Panchayat Union School, Dindigul", location: "Market Street, Dindigul" },
              { number: 103, name: "Community Hall, Dindigul", location: "Station Road, Dindigul" },
            ]
          },
          {
            name: "Dindigul South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Dindigul", location: "Main Road, Dindigul" },
              { number: 102, name: "Panchayat Union School, Dindigul", location: "Market Street, Dindigul" },
              { number: 103, name: "Community Hall, Dindigul", location: "Station Road, Dindigul" },
            ]
          },
        ]
      },
      {
        name: "Erode",
        constituencies: [
          {
            name: "Erode North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Erode", location: "Main Road, Erode" },
              { number: 102, name: "Panchayat Union School, Erode", location: "Market Street, Erode" },
              { number: 103, name: "Community Hall, Erode", location: "Station Road, Erode" },
            ]
          },
          {
            name: "Erode South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Erode", location: "Main Road, Erode" },
              { number: 102, name: "Panchayat Union School, Erode", location: "Market Street, Erode" },
              { number: 103, name: "Community Hall, Erode", location: "Station Road, Erode" },
            ]
          },
        ]
      },
      {
        name: "Kallakurichi",
        constituencies: [
          {
            name: "Kallakurichi North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Kallakurichi", location: "Main Road, Kallakurichi" },
              { number: 102, name: "Panchayat Union School, Kallakurichi", location: "Market Street, Kallakurichi" },
              { number: 103, name: "Community Hall, Kallakurichi", location: "Station Road, Kallakurichi" },
            ]
          },
          {
            name: "Kallakurichi South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Kallakurichi", location: "Main Road, Kallakurichi" },
              { number: 102, name: "Panchayat Union School, Kallakurichi", location: "Market Street, Kallakurichi" },
              { number: 103, name: "Community Hall, Kallakurichi", location: "Station Road, Kallakurichi" },
            ]
          },
        ]
      },
      {
        name: "Kanchipuram",
        constituencies: [
          {
            name: "Kanchipuram North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Kanchipuram", location: "Main Road, Kanchipuram" },
              { number: 102, name: "Panchayat Union School, Kanchipuram", location: "Market Street, Kanchipuram" },
              { number: 103, name: "Community Hall, Kanchipuram", location: "Station Road, Kanchipuram" },
            ]
          },
          {
            name: "Kanchipuram South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Kanchipuram", location: "Main Road, Kanchipuram" },
              { number: 102, name: "Panchayat Union School, Kanchipuram", location: "Market Street, Kanchipuram" },
              { number: 103, name: "Community Hall, Kanchipuram", location: "Station Road, Kanchipuram" },
            ]
          },
        ]
      },
      {
        name: "Kanyakumari",
        constituencies: [
          {
            name: "Kanyakumari North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Kanyakumari", location: "Main Road, Kanyakumari" },
              { number: 102, name: "Panchayat Union School, Kanyakumari", location: "Market Street, Kanyakumari" },
              { number: 103, name: "Community Hall, Kanyakumari", location: "Station Road, Kanyakumari" },
            ]
          },
          {
            name: "Kanyakumari South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Kanyakumari", location: "Main Road, Kanyakumari" },
              { number: 102, name: "Panchayat Union School, Kanyakumari", location: "Market Street, Kanyakumari" },
              { number: 103, name: "Community Hall, Kanyakumari", location: "Station Road, Kanyakumari" },
            ]
          },
        ]
      },
      {
        name: "Karur",
        constituencies: [
          {
            name: "Karur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Karur", location: "Main Road, Karur" },
              { number: 102, name: "Panchayat Union School, Karur", location: "Market Street, Karur" },
              { number: 103, name: "Community Hall, Karur", location: "Station Road, Karur" },
            ]
          },
          {
            name: "Karur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Karur", location: "Main Road, Karur" },
              { number: 102, name: "Panchayat Union School, Karur", location: "Market Street, Karur" },
              { number: 103, name: "Community Hall, Karur", location: "Station Road, Karur" },
            ]
          },
        ]
      },
      {
        name: "Krishnagiri",
        constituencies: [
          {
            name: "Krishnagiri North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Krishnagiri", location: "Main Road, Krishnagiri" },
              { number: 102, name: "Panchayat Union School, Krishnagiri", location: "Market Street, Krishnagiri" },
              { number: 103, name: "Community Hall, Krishnagiri", location: "Station Road, Krishnagiri" },
            ]
          },
          {
            name: "Krishnagiri South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Krishnagiri", location: "Main Road, Krishnagiri" },
              { number: 102, name: "Panchayat Union School, Krishnagiri", location: "Market Street, Krishnagiri" },
              { number: 103, name: "Community Hall, Krishnagiri", location: "Station Road, Krishnagiri" },
            ]
          },
        ]
      },
      {
        name: "Madurai",
        constituencies: [
          {
            name: "Madurai North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Madurai", location: "Main Road, Madurai" },
              { number: 102, name: "Panchayat Union School, Madurai", location: "Market Street, Madurai" },
              { number: 103, name: "Community Hall, Madurai", location: "Station Road, Madurai" },
            ]
          },
          {
            name: "Madurai South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Madurai", location: "Main Road, Madurai" },
              { number: 102, name: "Panchayat Union School, Madurai", location: "Market Street, Madurai" },
              { number: 103, name: "Community Hall, Madurai", location: "Station Road, Madurai" },
            ]
          },
        ]
      },
      {
        name: "Mayiladuthurai",
        constituencies: [
          {
            name: "Mayiladuthurai North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Mayiladuthurai", location: "Main Road, Mayiladuthurai" },
              { number: 102, name: "Panchayat Union School, Mayiladuthurai", location: "Market Street, Mayiladuthurai" },
              { number: 103, name: "Community Hall, Mayiladuthurai", location: "Station Road, Mayiladuthurai" },
            ]
          },
          {
            name: "Mayiladuthurai South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Mayiladuthurai", location: "Main Road, Mayiladuthurai" },
              { number: 102, name: "Panchayat Union School, Mayiladuthurai", location: "Market Street, Mayiladuthurai" },
              { number: 103, name: "Community Hall, Mayiladuthurai", location: "Station Road, Mayiladuthurai" },
            ]
          },
        ]
      },
      {
        name: "Nagapattinam",
        constituencies: [
          {
            name: "Nagapattinam North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Nagapattinam", location: "Main Road, Nagapattinam" },
              { number: 102, name: "Panchayat Union School, Nagapattinam", location: "Market Street, Nagapattinam" },
              { number: 103, name: "Community Hall, Nagapattinam", location: "Station Road, Nagapattinam" },
            ]
          },
          {
            name: "Nagapattinam South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Nagapattinam", location: "Main Road, Nagapattinam" },
              { number: 102, name: "Panchayat Union School, Nagapattinam", location: "Market Street, Nagapattinam" },
              { number: 103, name: "Community Hall, Nagapattinam", location: "Station Road, Nagapattinam" },
            ]
          },
        ]
      },
      {
        name: "Namakkal",
        constituencies: [
          {
            name: "Namakkal North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Namakkal", location: "Main Road, Namakkal" },
              { number: 102, name: "Panchayat Union School, Namakkal", location: "Market Street, Namakkal" },
              { number: 103, name: "Community Hall, Namakkal", location: "Station Road, Namakkal" },
            ]
          },
          {
            name: "Namakkal South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Namakkal", location: "Main Road, Namakkal" },
              { number: 102, name: "Panchayat Union School, Namakkal", location: "Market Street, Namakkal" },
              { number: 103, name: "Community Hall, Namakkal", location: "Station Road, Namakkal" },
            ]
          },
        ]
      },
      {
        name: "Nilgiris",
        constituencies: [
          {
            name: "Nilgiris North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Nilgiris", location: "Main Road, Nilgiris" },
              { number: 102, name: "Panchayat Union School, Nilgiris", location: "Market Street, Nilgiris" },
              { number: 103, name: "Community Hall, Nilgiris", location: "Station Road, Nilgiris" },
            ]
          },
          {
            name: "Nilgiris South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Nilgiris", location: "Main Road, Nilgiris" },
              { number: 102, name: "Panchayat Union School, Nilgiris", location: "Market Street, Nilgiris" },
              { number: 103, name: "Community Hall, Nilgiris", location: "Station Road, Nilgiris" },
            ]
          },
        ]
      },
      {
        name: "Perambalur",
        constituencies: [
          {
            name: "Perambalur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Perambalur", location: "Main Road, Perambalur" },
              { number: 102, name: "Panchayat Union School, Perambalur", location: "Market Street, Perambalur" },
              { number: 103, name: "Community Hall, Perambalur", location: "Station Road, Perambalur" },
            ]
          },
          {
            name: "Perambalur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Perambalur", location: "Main Road, Perambalur" },
              { number: 102, name: "Panchayat Union School, Perambalur", location: "Market Street, Perambalur" },
              { number: 103, name: "Community Hall, Perambalur", location: "Station Road, Perambalur" },
            ]
          },
        ]
      },
      {
        name: "Pudukkottai",
        constituencies: [
          {
            name: "Pudukkottai North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Pudukkottai", location: "Main Road, Pudukkottai" },
              { number: 102, name: "Panchayat Union School, Pudukkottai", location: "Market Street, Pudukkottai" },
              { number: 103, name: "Community Hall, Pudukkottai", location: "Station Road, Pudukkottai" },
            ]
          },
          {
            name: "Pudukkottai South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Pudukkottai", location: "Main Road, Pudukkottai" },
              { number: 102, name: "Panchayat Union School, Pudukkottai", location: "Market Street, Pudukkottai" },
              { number: 103, name: "Community Hall, Pudukkottai", location: "Station Road, Pudukkottai" },
            ]
          },
        ]
      },
      {
        name: "Ramanathapuram",
        constituencies: [
          {
            name: "Ramanathapuram North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Ramanathapuram", location: "Main Road, Ramanathapuram" },
              { number: 102, name: "Panchayat Union School, Ramanathapuram", location: "Market Street, Ramanathapuram" },
              { number: 103, name: "Community Hall, Ramanathapuram", location: "Station Road, Ramanathapuram" },
            ]
          },
          {
            name: "Ramanathapuram South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Ramanathapuram", location: "Main Road, Ramanathapuram" },
              { number: 102, name: "Panchayat Union School, Ramanathapuram", location: "Market Street, Ramanathapuram" },
              { number: 103, name: "Community Hall, Ramanathapuram", location: "Station Road, Ramanathapuram" },
            ]
          },
        ]
      },
      {
        name: "Ranipet",
        constituencies: [
          {
            name: "Ranipet North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Ranipet", location: "Main Road, Ranipet" },
              { number: 102, name: "Panchayat Union School, Ranipet", location: "Market Street, Ranipet" },
              { number: 103, name: "Community Hall, Ranipet", location: "Station Road, Ranipet" },
            ]
          },
          {
            name: "Ranipet South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Ranipet", location: "Main Road, Ranipet" },
              { number: 102, name: "Panchayat Union School, Ranipet", location: "Market Street, Ranipet" },
              { number: 103, name: "Community Hall, Ranipet", location: "Station Road, Ranipet" },
            ]
          },
        ]
      },
      {
        name: "Salem",
        constituencies: [
          {
            name: "Salem North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Salem", location: "Main Road, Salem" },
              { number: 102, name: "Panchayat Union School, Salem", location: "Market Street, Salem" },
              { number: 103, name: "Community Hall, Salem", location: "Station Road, Salem" },
            ]
          },
          {
            name: "Salem South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Salem", location: "Main Road, Salem" },
              { number: 102, name: "Panchayat Union School, Salem", location: "Market Street, Salem" },
              { number: 103, name: "Community Hall, Salem", location: "Station Road, Salem" },
            ]
          },
        ]
      },
      {
        name: "Sivaganga",
        constituencies: [
          {
            name: "Sivaganga North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Sivaganga", location: "Main Road, Sivaganga" },
              { number: 102, name: "Panchayat Union School, Sivaganga", location: "Market Street, Sivaganga" },
              { number: 103, name: "Community Hall, Sivaganga", location: "Station Road, Sivaganga" },
            ]
          },
          {
            name: "Sivaganga South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Sivaganga", location: "Main Road, Sivaganga" },
              { number: 102, name: "Panchayat Union School, Sivaganga", location: "Market Street, Sivaganga" },
              { number: 103, name: "Community Hall, Sivaganga", location: "Station Road, Sivaganga" },
            ]
          },
        ]
      },
      {
        name: "Tenkasi",
        constituencies: [
          {
            name: "Tenkasi North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tenkasi", location: "Main Road, Tenkasi" },
              { number: 102, name: "Panchayat Union School, Tenkasi", location: "Market Street, Tenkasi" },
              { number: 103, name: "Community Hall, Tenkasi", location: "Station Road, Tenkasi" },
            ]
          },
          {
            name: "Tenkasi South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tenkasi", location: "Main Road, Tenkasi" },
              { number: 102, name: "Panchayat Union School, Tenkasi", location: "Market Street, Tenkasi" },
              { number: 103, name: "Community Hall, Tenkasi", location: "Station Road, Tenkasi" },
            ]
          },
        ]
      },
      {
        name: "Thanjavur",
        constituencies: [
          {
            name: "Thanjavur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Thanjavur", location: "Main Road, Thanjavur" },
              { number: 102, name: "Panchayat Union School, Thanjavur", location: "Market Street, Thanjavur" },
              { number: 103, name: "Community Hall, Thanjavur", location: "Station Road, Thanjavur" },
            ]
          },
          {
            name: "Thanjavur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Thanjavur", location: "Main Road, Thanjavur" },
              { number: 102, name: "Panchayat Union School, Thanjavur", location: "Market Street, Thanjavur" },
              { number: 103, name: "Community Hall, Thanjavur", location: "Station Road, Thanjavur" },
            ]
          },
        ]
      },
      {
        name: "Theni",
        constituencies: [
          {
            name: "Theni North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Theni", location: "Main Road, Theni" },
              { number: 102, name: "Panchayat Union School, Theni", location: "Market Street, Theni" },
              { number: 103, name: "Community Hall, Theni", location: "Station Road, Theni" },
            ]
          },
          {
            name: "Theni South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Theni", location: "Main Road, Theni" },
              { number: 102, name: "Panchayat Union School, Theni", location: "Market Street, Theni" },
              { number: 103, name: "Community Hall, Theni", location: "Station Road, Theni" },
            ]
          },
        ]
      },
      {
        name: "Thoothukudi",
        constituencies: [
          {
            name: "Thoothukudi North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Thoothukudi", location: "Main Road, Thoothukudi" },
              { number: 102, name: "Panchayat Union School, Thoothukudi", location: "Market Street, Thoothukudi" },
              { number: 103, name: "Community Hall, Thoothukudi", location: "Station Road, Thoothukudi" },
            ]
          },
          {
            name: "Thoothukudi South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Thoothukudi", location: "Main Road, Thoothukudi" },
              { number: 102, name: "Panchayat Union School, Thoothukudi", location: "Market Street, Thoothukudi" },
              { number: 103, name: "Community Hall, Thoothukudi", location: "Station Road, Thoothukudi" },
            ]
          },
        ]
      },
      {
        name: "Tiruchirappalli",
        constituencies: [
          {
            name: "Tiruchirappalli North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruchirappalli", location: "Main Road, Tiruchirappalli" },
              { number: 102, name: "Panchayat Union School, Tiruchirappalli", location: "Market Street, Tiruchirappalli" },
              { number: 103, name: "Community Hall, Tiruchirappalli", location: "Station Road, Tiruchirappalli" },
            ]
          },
          {
            name: "Tiruchirappalli South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruchirappalli", location: "Main Road, Tiruchirappalli" },
              { number: 102, name: "Panchayat Union School, Tiruchirappalli", location: "Market Street, Tiruchirappalli" },
              { number: 103, name: "Community Hall, Tiruchirappalli", location: "Station Road, Tiruchirappalli" },
            ]
          },
        ]
      },
      {
        name: "Tirunelveli",
        constituencies: [
          {
            name: "Tirunelveli North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tirunelveli", location: "Main Road, Tirunelveli" },
              { number: 102, name: "Panchayat Union School, Tirunelveli", location: "Market Street, Tirunelveli" },
              { number: 103, name: "Community Hall, Tirunelveli", location: "Station Road, Tirunelveli" },
            ]
          },
          {
            name: "Tirunelveli South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tirunelveli", location: "Main Road, Tirunelveli" },
              { number: 102, name: "Panchayat Union School, Tirunelveli", location: "Market Street, Tirunelveli" },
              { number: 103, name: "Community Hall, Tirunelveli", location: "Station Road, Tirunelveli" },
            ]
          },
        ]
      },
      {
        name: "Tirupathur",
        constituencies: [
          {
            name: "Tirupathur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tirupathur", location: "Main Road, Tirupathur" },
              { number: 102, name: "Panchayat Union School, Tirupathur", location: "Market Street, Tirupathur" },
              { number: 103, name: "Community Hall, Tirupathur", location: "Station Road, Tirupathur" },
            ]
          },
          {
            name: "Tirupathur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tirupathur", location: "Main Road, Tirupathur" },
              { number: 102, name: "Panchayat Union School, Tirupathur", location: "Market Street, Tirupathur" },
              { number: 103, name: "Community Hall, Tirupathur", location: "Station Road, Tirupathur" },
            ]
          },
        ]
      },
      {
        name: "Tiruppur",
        constituencies: [
          {
            name: "Tiruppur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruppur", location: "Main Road, Tiruppur" },
              { number: 102, name: "Panchayat Union School, Tiruppur", location: "Market Street, Tiruppur" },
              { number: 103, name: "Community Hall, Tiruppur", location: "Station Road, Tiruppur" },
            ]
          },
          {
            name: "Tiruppur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruppur", location: "Main Road, Tiruppur" },
              { number: 102, name: "Panchayat Union School, Tiruppur", location: "Market Street, Tiruppur" },
              { number: 103, name: "Community Hall, Tiruppur", location: "Station Road, Tiruppur" },
            ]
          },
        ]
      },
      {
        name: "Tiruvallur",
        constituencies: [
          {
            name: "Tiruvallur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruvallur", location: "Main Road, Tiruvallur" },
              { number: 102, name: "Panchayat Union School, Tiruvallur", location: "Market Street, Tiruvallur" },
              { number: 103, name: "Community Hall, Tiruvallur", location: "Station Road, Tiruvallur" },
            ]
          },
          {
            name: "Tiruvallur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruvallur", location: "Main Road, Tiruvallur" },
              { number: 102, name: "Panchayat Union School, Tiruvallur", location: "Market Street, Tiruvallur" },
              { number: 103, name: "Community Hall, Tiruvallur", location: "Station Road, Tiruvallur" },
            ]
          },
        ]
      },
      {
        name: "Tiruvannamalai",
        constituencies: [
          {
            name: "Tiruvannamalai North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruvannamalai", location: "Main Road, Tiruvannamalai" },
              { number: 102, name: "Panchayat Union School, Tiruvannamalai", location: "Market Street, Tiruvannamalai" },
              { number: 103, name: "Community Hall, Tiruvannamalai", location: "Station Road, Tiruvannamalai" },
            ]
          },
          {
            name: "Tiruvannamalai South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruvannamalai", location: "Main Road, Tiruvannamalai" },
              { number: 102, name: "Panchayat Union School, Tiruvannamalai", location: "Market Street, Tiruvannamalai" },
              { number: 103, name: "Community Hall, Tiruvannamalai", location: "Station Road, Tiruvannamalai" },
            ]
          },
        ]
      },
      {
        name: "Tiruvarur",
        constituencies: [
          {
            name: "Tiruvarur North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruvarur", location: "Main Road, Tiruvarur" },
              { number: 102, name: "Panchayat Union School, Tiruvarur", location: "Market Street, Tiruvarur" },
              { number: 103, name: "Community Hall, Tiruvarur", location: "Station Road, Tiruvarur" },
            ]
          },
          {
            name: "Tiruvarur South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Tiruvarur", location: "Main Road, Tiruvarur" },
              { number: 102, name: "Panchayat Union School, Tiruvarur", location: "Market Street, Tiruvarur" },
              { number: 103, name: "Community Hall, Tiruvarur", location: "Station Road, Tiruvarur" },
            ]
          },
        ]
      },
      {
        name: "Vellore",
        constituencies: [
          {
            name: "Vellore North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Vellore", location: "Main Road, Vellore" },
              { number: 102, name: "Panchayat Union School, Vellore", location: "Market Street, Vellore" },
              { number: 103, name: "Community Hall, Vellore", location: "Station Road, Vellore" },
            ]
          },
          {
            name: "Vellore South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Vellore", location: "Main Road, Vellore" },
              { number: 102, name: "Panchayat Union School, Vellore", location: "Market Street, Vellore" },
              { number: 103, name: "Community Hall, Vellore", location: "Station Road, Vellore" },
            ]
          },
        ]
      },
      {
        name: "Viluppuram",
        constituencies: [
          {
            name: "Viluppuram North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Viluppuram", location: "Main Road, Viluppuram" },
              { number: 102, name: "Panchayat Union School, Viluppuram", location: "Market Street, Viluppuram" },
              { number: 103, name: "Community Hall, Viluppuram", location: "Station Road, Viluppuram" },
            ]
          },
          {
            name: "Viluppuram South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Viluppuram", location: "Main Road, Viluppuram" },
              { number: 102, name: "Panchayat Union School, Viluppuram", location: "Market Street, Viluppuram" },
              { number: 103, name: "Community Hall, Viluppuram", location: "Station Road, Viluppuram" },
            ]
          },
        ]
      },
      {
        name: "Virudhunagar",
        constituencies: [
          {
            name: "Virudhunagar North",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Virudhunagar", location: "Main Road, Virudhunagar" },
              { number: 102, name: "Panchayat Union School, Virudhunagar", location: "Market Street, Virudhunagar" },
              { number: 103, name: "Community Hall, Virudhunagar", location: "Station Road, Virudhunagar" },
            ]
          },
          {
            name: "Virudhunagar South",
            pollingStations: [
              { number: 101, name: "Govt. Higher Secondary School, Virudhunagar", location: "Main Road, Virudhunagar" },
              { number: 102, name: "Panchayat Union School, Virudhunagar", location: "Market Street, Virudhunagar" },
              { number: 103, name: "Community Hall, Virudhunagar", location: "Station Road, Virudhunagar" },
            ]
          },
        ]
      },
    ]
  }
];

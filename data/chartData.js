export const weightData = {
  labels: Array.from({ length: 33 }, (_, i) => i + 8),
  datasets: [
    {
      label: "Upper Limit (g)",
      data: [
        40, 40, 40, 100, 100, 100, 100, 100, 130, 170, 220, 270, 330, 390,
        460, 531, 630, 690, 790, 905, 1035, 1183, 1349, 1532, 1732, 1948,
        2176, 2413, 2652, 2889, 3113, 3318, 3492,
      ],
      borderColor: "red",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.3,
    },
    {
      label: "Lower Limit (g)",
      data: [
        0, 0, 0, 20, 20, 20, 20, 20, 40, 70, 110, 160, 210, 270, 330, 400,
        471, 570, 630, 730, 845, 975, 1123, 1279, 1472, 1688, 1916, 2153,
        2392, 2630, 2859, 3083, 3288,
      ],
      borderColor: "blue",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.3,
    },
    {
      label: "Deviation (g)",
      data: [
        25, 25, 25, 65, 65, 65, 65, 65, 90, 125, 170, 220, 275, 335, 400,
        471, 555, 635, 715, 820, 945, 1084, 1241, 1410, 1607, 1823, 2051,
        2288, null, null, null, null, null,
      ],
      borderColor: "green",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      tension: 0.3,
    },
    {
      label: " ",
      data: [
        null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, 2288, 2527, 2765, 2991, 3205, 3395,
      ],
      borderColor: "gray",
      backgroundColor: "rgba(236, 227, 227, 0.2)",
      tension: 0.3,
    },
  ],
};

export const heightData = {
  labels: Array.from({ length: 33 }, (_, i) => i + 8),
  datasets: [
    {
      label: "Upper Limit (cm)",
      data: [4.6, 5.3, 6.1, 7.1, 8.4, 10.4, 11.7, 13.1, 14.6, 16.0, 17.2, 18.3,
        19.4, 28.6, 30.8, 31.9, 33.0, 37.6, 38.6, 39.6, 40.6, 41.9, 43.1,
        44.4, 45.7, 46.9, 48.1, 49.3, 50.5, 51.4, 52.2, 54.2, 54.7],
      borderColor: "red",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.3,
    },
    {
      label: "Lower Limit (cm)",
      data: [0, 0, 0.1, 1.1, 2.4, 4.4, 5.7, 7.1, 8.6, 10.0, 11.2, 12.3, 13.4, 22.6,
        24.8, 25.9, 27.0, 31.6, 32.6, 33.6, 34.6, 35.9, 37.1, 38.4, 39.7,
        40.9, 42.1, 43.3, 44.5, 45.4, 46.2, 48.2, 48.7],
      borderColor: "blue",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.3,
    },
    {
      label: "Deviation (cm)",
      data: [1.6, 2.3, 3.1, 4.1, 5.4, 7.4, 8.7, 10.1, 11.6, 13.0, 14.2, 15.3, 16.4,
        25.6, 27.8, 28.9, 30.0, 34.6, 35.6, 36.6, 37.6, 38.9, 40.1, 41.4,
        42.7, 43.9, 45.1, 46.3, null, null, null, null, null],
      borderColor: "green",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      tension: 0.3,
    },
    {
      label: " ",
      data: [null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, 46.3, 47.5, 48.4, 49.2, 51.2, 51.7],
      borderColor: "gray",
      backgroundColor: "rgba(236, 227, 227, 0.2)",
      tension: 0.3,
    }
  ],
};

export const circumferenceData = {
  labels: Array.from({ length: 33 }, (_, i) => i + 8),
  datasets: [
    {
      label: "Upper Limit (mm)",
      data: [80, 94, 107.9, 124, 132, 144, 158, 170, 187, 192, 203, 218, 231, 249,
        251, 266, 281, 283, 287, 292, 302, 312, 319, 327, 332, 340, 346, 355,
        365, null, null, null, null],
      borderColor: "red",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.3,
    },
    {
      label: "Lower Limit (mm)",
      data: [60, 74, 87.9, 104, 112, 124, 138, 150, 167, 172, 183, 198, 211, 229,
        231, 246, 261, 263, 267, 272, 282, 292, 299, 307, 312, 320, 326, 335,
        345, null, null, null, null],
      borderColor: "blue",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.3,
    },
    {
      label: "Deviation (mm)",
      data: [70, 84, 97.9, 114, 122, 134, 148, 160, 177, 182, 193, 208, 221, 239,
        241, 256, 271, 273, 277, 282, 292, 302, 309, 317, 322, 330, 336, 345,
        null, null, null, null, null],
      borderColor: "green",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      tension: 0.3,
    },
    {
      label: " ",
      data: [null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, 345, 354, 360, 365, 370, 375],
      borderColor: "gray",
      backgroundColor: "rgba(236, 227, 227, 0.2)",
      tension: 0.3,
    }
  ],
};
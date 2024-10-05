import { Stats } from './constant'

export const FourStarScaling = [
  1, 1.083, 1.165, 1.248, 1.33, 1.413, 1.495, 1.578, 1.661, 1.743, 1.826, 1.908, 1.991, 2.073, 2.156, 2.239, 2.321,
  2.404, 2.486, 2.569, 2.651, 2.734, 2.817, 2.899, 2.982, 3.064, 3.147, 3.229, 3.312, 3.394, 3.477, 3.56, 3.642, 3.725,
  3.807, 3.89, 3.972, 4.055, 4.138, 4.22, 4.303, 4.385, 4.468, 4.55, 4.633, 4.716, 4.798, 4.881, 4.963, 5.046, 5.128,
  5.211, 5.294, 5.376, 5.459, 5.541, 5.624, 5.706, 5.789, 5.872, 5.954, 6.037, 6.119, 6.202, 6.284, 6.367, 6.45, 6.532,
  6.615, 6.697, 6.78, 6.862, 6.945, 7.028, 7.11, 7.193, 7.275, 7.358, 7.44, 7.523, 7.606, 7.688, 7.771, 7.853, 7.936,
  8.018, 8.101, 8.183, 8.266, 8.349,
]

export const FiveStarScaling = [
  1, 1.083, 1.166, 1.25, 1.333, 1.417, 1.5, 1.584, 1.668, 1.751, 1.835, 1.919, 2.003, 2.088, 2.172, 2.256, 2.341, 2.425,
  2.51, 2.594, 2.679, 2.764, 2.849, 2.934, 3.019, 3.105, 3.19, 3.275, 3.361, 3.446, 3.532, 3.618, 3.704, 3.789, 3.875,
  3.962, 4.048, 4.134, 4.22, 4.307, 4.393, 4.48, 4.567, 4.653, 4.74, 4.827, 4.914, 5.001, 5.089, 5.176, 5.263, 5.351,
  5.438, 5.526, 5.614, 5.702, 5.79, 5.878, 5.966, 6.054, 6.142, 6.23, 6.319, 6.407, 6.496, 6.585, 6.673, 6.762, 6.851,
  6.94, 7.029, 7.119, 7.208, 7.297, 7.387, 7.476, 7.566, 7.656, 7.746, 7.836, 7.926, 8.016, 8.106, 8.196, 8.286, 8.377,
  8.467, 8.558, 8.649, 8.739,
]

export const AscensionScaling = [0, 0.2087912088, 0.3571428571, 0.5549450549, 0.7032967033, 0.8516483516, 1]

export const WeaponSecondaryScaling = [
  1, 1.162, 1.363, 1.565, 1.767, 1.969, 2.171, 2.373, 2.575, 2.777, 2.979, 3.181, 3.383, 3.585, 3.786, 3.988, 4.195,
  4.392, 4.594,
]

export const WeaponScaling = {
  1: {
    base: [23.245],
    ascension: [0, 11.7, 23.3, 35.0, 46.7],
  },
  3: {
    base: [37.6075, 38.7413, 39.8751],
    ascension: [0, 19.5, 38.9, 58.4, 77.8, 97.3, 116.7],
    level: {
      1: [
        1, 1.071, 1.141, 1.211, 1.28, 1.349, 1.417, 1.486, 1.553, 1.621, 1.688, 1.754, 1.82, 1.886, 1.952, 2.017, 2.082,
        2.147, 2.211, 2.275, 2.339, 2.402, 2.466, 2.529, 2.591, 2.654, 2.716, 2.778, 2.84, 2.901, 2.962, 3.023, 3.084,
        3.145, 3.205, 3.265, 3.325, 3.385, 3.445, 3.504, 3.564, 3.623, 3.682, 3.741, 3.799, 3.858, 3.916, 3.974, 4.032,
        4.09, 4.148, 4.205, 4.263, 4.32, 4.377, 4.434, 4.491, 4.548, 4.605, 4.661, 4.718, 4.774, 4.83, 4.887, 4.943,
        4.999, 5.054, 5.11, 5.166, 5.222, 5.277, 5.333, 5.388, 5.443, 5.498, 5.554, 5.609, 5.664, 5.719, 5.774, 5.828,
        5.883, 5.938, 5.993, 6.047, 6.102, 6.156, 6.211, 6.265, 6.32,
      ],
      2: [
        1, 1.076, 1.152, 1.228, 1.303, 1.379, 1.454, 1.529, 1.604, 1.679, 1.754, 1.828, 1.903, 1.977, 2.051, 2.125,
        2.199, 2.273, 2.347, 2.42, 2.493, 2.567, 2.64, 2.713, 2.786, 2.859, 2.931, 3.004, 3.076, 3.148, 3.221, 3.293,
        3.365, 3.437, 3.508, 3.58, 3.652, 3.723, 3.794, 3.866, 3.937, 4.008, 4.079, 4.15, 4.221, 4.291, 4.362, 4.433,
        4.503, 4.574, 4.644, 4.714, 4.784, 4.855, 4.925, 4.995, 5.065, 5.134, 5.204, 5.274, 5.344, 5.413, 5.483, 5.552,
        5.622, 5.691, 5.761, 5.83, 5.899, 5.968, 6.038, 6.107, 6.176, 6.245, 6.314, 6.383, 6.452, 6.521, 6.59, 6.659,
        6.727, 6.796, 6.865, 6.934, 7.003, 7.071, 7.14, 7.209, 7.277, 7.346,
      ],
      3: [
        1, 1.081, 1.162, 1.244, 1.325, 1.407, 1.489, 1.57, 1.652, 1.734, 1.816, 1.898, 1.981, 2.063, 2.145, 2.227, 2.31,
        2.392, 2.474, 2.557, 2.639, 2.722, 2.804, 2.887, 2.969, 3.052, 3.134, 3.217, 3.299, 3.382, 3.464, 3.547, 3.629,
        3.712, 3.794, 3.877, 3.959, 4.042, 4.124, 4.206, 4.289, 4.371, 4.454, 4.536, 4.618, 4.701, 4.783, 4.865, 4.948,
        5.03, 5.112, 5.194, 5.277, 5.359, 5.441, 5.523, 5.605, 5.688, 5.77, 5.852, 5.934, 6.016, 6.098, 6.18, 6.262,
        6.344, 6.427, 6.509, 6.591, 6.673, 6.755, 6.837, 6.919, 7.001, 7.083, 7.165, 7.247, 7.329, 7.411, 7.493, 7.575,
        7.657, 7.739, 7.821, 7.904, 7.986, 8.068, 8.15, 8.232, 8.314,
      ],
    },
  },
  4: {
    base: [41.0671, 42.401, 43.7349, 45.0687],
    ascension: [0, 25.9, 51.9, 77.8, 103.7, 129.7, 155.6],
    level: {
      1: [
        1, 1.077, 1.154, 1.23, 1.306, 1.382, 1.457, 1.533, 1.607, 1.682, 1.757, 1.831, 1.905, 1.979, 2.052, 2.126,
        2.199, 2.272, 2.345, 2.417, 2.49, 2.562, 2.634, 2.707, 2.778, 2.85, 2.922, 2.993, 3.065, 3.136, 3.207, 3.278,
        3.349, 3.42, 3.49, 3.561, 3.632, 3.702, 3.772, 3.842, 3.913, 3.983, 4.053, 4.122, 4.192, 4.262, 4.332, 4.401,
        4.471, 4.54, 4.609, 4.679, 4.748, 4.817, 4.886, 4.955, 5.024, 5.093, 5.162, 5.231, 5.3, 5.368, 5.437, 5.506,
        5.574, 5.643, 5.711, 5.78, 5.848, 5.916, 5.985, 6.053, 6.121, 6.189, 6.257, 6.326, 6.394, 6.462, 6.53, 6.598,
        6.665, 6.733, 6.801, 6.869, 6.937, 7.005, 7.072, 7.14, 7.208, 7.275,
      ],
      2: [
        1, 1.083, 1.165, 1.248, 1.33, 1.413, 1.495, 1.578, 1.661, 1.743, 1.826, 1.908, 1.991, 2.073, 2.156, 2.239,
        2.321, 2.404, 2.486, 2.569, 2.651, 2.734, 2.817, 2.899, 2.982, 3.064, 3.147, 3.229, 3.312, 3.394, 3.477, 3.56,
        3.642, 3.725, 3.807, 3.89, 3.972, 4.055, 4.138, 4.22, 4.303, 4.385, 4.468, 4.55, 4.633, 4.716, 4.798, 4.881,
        4.963, 5.046, 5.128, 5.211, 5.294, 5.376, 5.459, 5.541, 5.624, 5.706, 5.789, 5.872, 5.954, 6.037, 6.119, 6.202,
        6.284, 6.367, 6.45, 6.532, 6.615, 6.697, 6.78, 6.862, 6.945, 7.028, 7.11, 7.193, 7.275, 7.358, 7.44, 7.523,
        7.606, 7.688, 7.771, 7.853, 7.936, 8.018, 8.101, 8.183, 8.266, 8.349,
      ],
      3: [
        1, 1.088, 1.176, 1.264, 1.353, 1.442, 1.531, 1.621, 1.71, 1.8, 1.891, 1.981, 2.072, 2.162, 2.253, 2.345, 2.436,
        2.527, 2.619, 2.711, 2.803, 2.895, 2.987, 3.08, 3.172, 3.265, 3.358, 3.451, 3.544, 3.637, 3.731, 3.824, 3.918,
        4.011, 4.105, 4.199, 4.293, 4.387, 4.481, 4.575, 4.669, 4.763, 4.858, 4.952, 5.047, 5.142, 5.236, 5.331, 5.426,
        5.521, 5.616, 5.711, 5.806, 5.901, 5.996, 6.092, 6.187, 6.282, 6.378, 6.473, 6.569, 6.664, 6.76, 6.856, 6.951,
        7.047, 7.143, 7.239, 7.335, 7.431, 7.527, 7.623, 7.719, 7.815, 7.911, 8.007, 8.103, 8.199, 8.296, 8.392, 8.488,
        8.585, 8.681, 8.777, 8.874, 8.97, 9.067, 9.163, 9.26, 9.356,
      ],
      4: [
        1, 1.093, 1.186, 1.28, 1.374, 1.469, 1.565, 1.661, 1.757, 1.854, 1.952, 2.049, 2.147, 2.246, 2.345, 2.444,
        2.544, 2.644, 2.744, 2.845, 2.946, 3.047, 3.148, 3.25, 3.352, 3.454, 3.557, 3.66, 3.762, 3.866, 3.969, 4.073,
        4.177, 4.281, 4.385, 4.489, 4.594, 4.699, 4.803, 4.909, 5.014, 5.119, 5.225, 5.33, 5.436, 5.542, 5.648, 5.755,
        5.861, 5.968, 6.074, 6.181, 6.288, 6.395, 6.502, 6.609, 6.717, 6.824, 6.932, 7.039, 7.147, 7.255, 7.363, 7.471,
        7.579, 7.687, 7.795, 7.904, 8.012, 8.12, 8.229, 8.338, 8.446, 8.555, 8.664, 8.773, 8.882, 8.991, 9.1, 9.209,
        9.319, 9.428, 9.537, 9.647, 9.756, 9.866, 9.975, 10.085, 10.195, 10.305,
      ],
    },
  },
  5: {
    base: [44.3358, 45.9364, 47.537, 49.1377],
    ascension: [0, 31.1, 62.2, 93.4, 124.5, 155.6, 186.7],
    level: {
      1: [
        1, 1.079, 1.159, 1.238, 1.317, 1.395, 1.474, 1.552, 1.631, 1.709, 1.787, 1.865, 1.942, 2.02, 2.098, 2.175,
        2.253, 2.33, 2.408, 2.485, 2.562, 2.639, 2.717, 2.794, 2.871, 2.948, 3.026, 3.103, 3.18, 3.257, 3.334, 3.412,
        3.489, 3.566, 3.644, 3.721, 3.798, 3.876, 3.953, 4.031, 4.109, 4.186, 4.264, 4.342, 4.419, 4.497, 4.575, 4.653,
        4.731, 4.81, 4.888, 4.966, 5.044, 5.123, 5.201, 5.28, 5.359, 5.437, 5.516, 5.595, 5.674, 5.753, 5.833, 5.912,
        5.991, 6.071, 6.15, 6.23, 6.31, 6.39, 6.47, 6.55, 6.63, 6.71, 6.791, 6.871, 6.952, 7.033, 7.113, 7.194, 7.275,
        7.357, 7.438, 7.519, 7.601, 7.682, 7.764, 7.846, 7.928, 8.01,
      ],
      2: [
        1, 1.086, 1.171, 1.257, 1.343, 1.429, 1.516, 1.602, 1.689, 1.775, 1.862, 1.949, 2.036, 2.124, 2.211, 2.299,
        2.386, 2.474, 2.562, 2.65, 2.738, 2.827, 2.915, 3.004, 3.093, 3.182, 3.271, 3.36, 3.45, 3.539, 3.629, 3.719,
        3.809, 3.899, 3.989, 4.08, 4.17, 4.261, 4.352, 4.443, 4.534, 4.625, 4.717, 4.808, 4.9, 4.992, 5.084, 5.176,
        5.268, 5.36, 5.453, 5.546, 5.638, 5.731, 5.825, 5.918, 6.011, 6.105, 6.198, 6.292, 6.386, 6.48, 6.575, 6.669,
        6.763, 6.858, 6.953, 7.048, 7.143, 7.238, 7.334, 7.429, 7.525, 7.621, 7.717, 7.813, 7.909, 8.005, 8.102, 8.199,
        8.295, 8.392, 8.489, 8.587, 8.684, 8.782, 8.879, 8.977, 9.075, 9.173,
      ],
      3: [
        1, 1.091, 1.183, 1.275, 1.368, 1.461, 1.554, 1.648, 1.743, 1.837, 1.933, 2.028, 2.124, 2.22, 2.317, 2.414,
        2.511, 2.608, 2.706, 2.804, 2.903, 3.002, 3.101, 3.2, 3.3, 3.4, 3.5, 3.601, 3.701, 3.803, 3.904, 4.005, 4.107,
        4.209, 4.312, 4.414, 4.517, 4.62, 4.723, 4.827, 4.931, 5.035, 5.139, 5.243, 5.348, 5.453, 5.558, 5.663, 5.768,
        5.874, 5.98, 6.086, 6.192, 6.299, 6.406, 6.513, 6.62, 6.727, 6.835, 6.942, 7.05, 7.158, 7.267, 7.375, 7.484,
        7.592, 7.701, 7.811, 7.92, 8.03, 8.139, 8.249, 8.359, 8.47, 8.58, 8.691, 8.802, 8.913, 9.024, 9.135, 9.247,
        9.358, 9.47, 9.582, 9.694, 9.807, 9.919, 10.032, 10.145, 10.258,
      ],
      4: [
        1, 1.097, 1.194, 1.292, 1.391, 1.49, 1.59, 1.692, 1.792, 1.895, 1.998, 2.102, 2.206, 2.31, 2.415, 2.521, 2.627,
        2.733, 2.841, 2.949, 3.057, 3.165, 3.274, 3.384, 3.493, 3.604, 3.714, 3.825, 3.937, 4.049, 4.161, 4.273, 4.386,
        4.5, 4.613, 4.727, 4.841, 4.956, 5.071, 5.186, 5.301, 5.417, 5.533, 5.65, 5.767, 5.884, 6, 6.118, 6.236, 6.354,
        6.473, 6.592, 6.71, 6.83, 6.949, 7.069, 7.19, 7.309, 7.43, 7.55, 7.671, 7.792, 7.913, 8.035, 8.157, 8.279,
        8.401, 8.524, 8.646, 8.77, 8.893, 9.016, 9.14, 9.263, 9.387, 9.512, 9.636, 9.761, 9.886, 10.011, 10.136, 10.261,
        10.387, 10.513, 10.639, 10.765, 10.892, 11.018, 11.145, 11.272,
      ],
    },
  },
}

export const AscensionGrowth = {
  [Stats.P_ATK]: [0.06, 0.072],
  [Stats.P_HP]: [0.06, 0.072],
  [Stats.P_DEF]: [0.075, 0.09],
  [Stats.EM]: [24, 28.8],
  [Stats.ER]: [0.067, 0.08],
  [Stats.HEAL]: [0, 0.055],
  [Stats.CRIT_RATE]: [0, 0.048],
  [Stats.CRIT_DMG]: [0, 0.096],
  [Stats.PHYSICAL_DMG]: [0.075, 0],
  [Stats.PYRO_DMG]: [0.06, 0.072],
  [Stats.HYDRO_DMG]: [0.06, 0.072],
  [Stats.CRYO_DMG]: [0.06, 0.072],
  [Stats.ELECTRO_DMG]: [0.06, 0.072],
  [Stats.DENDRO_DMG]: [0.06, 0.072],
  [Stats.GEO_DMG]: [0.06, 0.072],
  [Stats.ANEMO_DMG]: [0.06, 0.072],
}

export const TalentScaling = {
  physical: {
    1: [
      1, 1.081334333, 1.162856072, 1.279047976, 1.360382309, 1.453523238, 1.581334333, 1.709332834, 1.837143928,
      1.976761619, 2.116191904, 2.255809595, 2.39523988, 2.534857571, 2.674475262,
    ],
    '1_alt': [
      1, 1.081334333, 1.162856072, 1.279047976, 1.360382309, 1.453523238, 1.581334333, 1.709332834, 1.837143928,
      1.976761619, 2.137, 2.325, 2.513, 2.701, 2.906,
    ],
    2: [1, 1.068, 1.136, 1.227, 1.295, 1.375, 1.477, 1.58, 1.682, 1.784, 1.886, 1.989, 2.091, 2.193, 2.295],
  },
  elemental: {
    1: [1, 1.075, 1.15, 1.25, 1.325, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.125, 2.25, 2.375],
    '1_alt': [1, 1.075, 1.15, 1.25, 1.325, 1.4, 1.5, 1.6, 1.7, 1.8, 1.904, 2.04, 2.176, 2.312, 2.448],
    2: [1, 1.06, 1.12, 1.198, 1.257, 1.317, 1.395, 1.473, 1.551, 1.629, 1.707, 1.784, 1.862, 1.94, 2.018],
  },
  special: {
    flat: [1, 1.1, 1.208, 1.325, 1.45, 1.583, 1.725, 1.875, 2.033, 2.2, 2.375, 2.559, 2.75, 2.95, 3.159],
    beidou: [1, 1.05, 1.1, 1.2, 1.25, 1.3, 1.4, 1.5, 1.6, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95],
    zhongli: [1, 1.108, 1.216, 1.351, 1.473, 1.595, 1.757, 1.919, 2.081, 2.243, 2.405, 2.568, 2.703, 2.838, 2.973],
    yoimiya: [1, 1.016, 1.033, 1.054, 1.071, 1.087, 1.109, 1.13, 1.151, 1.173, 1.194, 1.216, 1.237, 1.258, 1.28],
    wriothesley: [
      1, 1.018020535, 1.036110917, 1.059579521, 1.077669903, 1.095690438, 1.119159042, 1.142627645, 1.166096249,
      1.189564853, 0.01189564853, 0.01213033457, 0.0123650206,
    ],
    wanderer_a: [
      1, 1.014889457, 1.029703715, 1.049029929, 1.063844187, 1.078733644, 1.098059859, 1.117310874, 1.136637088,
      1.155963303, 1.175289517, 1.194540532, 1.213866747,
    ],
    wanderer_b: [
      1, 1.012500989, 1.025001978, 1.041221616, 1.053722605, 1.066223594, 1.082443231, 1.098741989, 1.114961627,
      1.131260385, 1.147480022, 1.16369966, 1.179998418,
    ],
  },
}

export const BaseReactionDmg = [
  17.165605, 18.535048, 19.904854, 21.274903, 22.6454, 24.649613, 26.640643, 28.868587, 31.367679, 34.143343, 37.201,
  40.66, 44.446668, 48.563519, 53.74848, 59.081897, 64.420047, 69.724455, 75.123137, 80.584775, 86.112028, 91.703742,
  97.244628, 102.812644, 108.409563, 113.201694, 118.102906, 122.979318, 129.72733, 136.29291, 142.67085, 149.029029,
  155.416987, 161.825495, 169.106313, 176.518077, 184.072741, 191.709518, 199.556908, 207.382042, 215.3989, 224.165667,
  233.50216, 243.350573, 256.063067, 268.543493, 281.526075, 295.013648, 309.067188, 323.601597, 336.757542, 350.530312,
  364.482705, 378.619181, 398.600417, 416.398254, 434.386996, 452.951051, 472.606217, 492.88489, 513.568543, 539.103198,
  565.510563, 592.538753, 624.443427, 651.470148, 679.49683, 707.79406, 736.671422, 765.640231, 794.773403, 824.677397,
  851.157781, 877.74209, 914.229123, 946.746752, 979.411386, 1011.223022, 1044.791746, 1077.443668, 1109.99754,
  1142.976615, 1176.369483, 1210.184393, 1253.835659, 1288.952801, 1325.484092, 1363.456928, 1405.097377, 1446.853458,
  1488.215547, 1528.444567, 1580.367911, 1630.847528, 1711.197785, 1780.453941, 1847.322809, 1911.474309, 1972.864342,
  2030.071808,
]

export const BaseCrystallizeShield = [
  91.1791, 98.707667, 106.23622, 113.764771, 121.293322, 128.821878, 136.350422, 143.878978, 151.407522, 158.936078,
  169.991484, 181.076253, 192.190362, 204.048207, 215.938996, 227.86275, 247.685944, 267.542105, 287.431209, 303.826417,
  320.225217, 336.627633, 352.319267, 368.010913, 383.702548, 394.432358, 405.18147, 415.949907, 426.737645, 437.544709,
  450.600004, 463.700301, 476.845577, 491.127512, 502.554564, 514.012104, 531.409589, 549.979601, 568.58488, 584.99652,
  605.670375, 626.386206, 646.052333, 665.755638, 685.496096, 700.839402, 723.333147, 745.865265, 768.435731,
  786.791945, 809.538812, 832.329057, 855.162654, 878.039628, 899.484802, 919.362018, 946.039586, 974.764223,
  1003.578617, 1030.077002, 1056.634974, 1085.246306, 1113.924427, 1149.25872, 1178.064819, 1200.223743, 1227.660294,
  1257.242987, 1284.917392, 1314.75288, 1342.665216, 1372.752485, 1396.320986, 1427.312436, 1458.374528, 1482.335772,
  1511.910837, 1541.549377, 1569.153701, 1596.814298, 1622.419626, 1648.074031, 1666.376146, 1684.678276, 1702.980391,
  1726.104684, 1754.671567, 1785.86656, 1817.137404, 1851.060358, 1885.067163, 1921.749303, 1958.523291, 2006.194108,
  2041.569007, 2054.472064, 2065.97498, 2174.7226, 2186.7682, 2198.81396,
]

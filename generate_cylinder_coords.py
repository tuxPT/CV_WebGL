#!/bin/env python

import math
import copy

def rotate(point, angle):
    x = point[0] * math.cos(angle) - point[1] * math.sin(angle)
    y = point[0] * math.sin(angle) + point[1] * math.cos(angle)
    return [x, y, 0.4]

angle = math.radians(10)
triangle = [[1.0, 0.0, 0.4], rotate([1.0, 0.0], angle), [0.0, 0.0, 0.4] ]

triangles = []
triangles.append(triangle)

i=1
while(i<360):
    triangle = triangles[-1].copy()
    triangle = [[triangle[1][0], triangle[1][1], 0.4], rotate([triangle[1][0], triangle[1][1]], angle), [0.0, 0.0, 0.4] ]
    triangles.append(triangle)
    i+=1


triangles_bellow = copy.deepcopy(triangles)

for index in range(len(triangles_bellow)):
    triangles_bellow[index][0][2] = -0.4
    triangles_bellow[index][1][2] = -0.4
    triangles_bellow[index][2][2] = -0.4


triangles.extend(triangles_bellow)

rectangles = []

for i in range(len(triangles)):
    for ib in range(len(triangles_bellow)):
        t1 = [triangles[i][0], triangles_bellow[ib][0], triangles_bellow[ib][1]]
        t2 = [triangles[i][0], triangles_bellow[ib][1], triangles[i][1]]
        rectangles.append(t1)
        rectangles.append(t2)

triangles.extend(rectangles)

print('{}\n\n'.format(len(triangles)*3))
for t in triangles:
    print('{} {} {}\n'.format(t[0][0], t[0][1], t[0][2]))
    print('{} {} {}\n'.format(t[1][0], t[1][1], t[1][2]))
    print('{} {} {}\n\n'.format(t[2][0], t[2][1], t[2][2]))


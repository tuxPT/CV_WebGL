#!/bin/env python

import math
import copy

globalz = 1.0
def rotate(point, angle):
    x = point[0] * math.cos(angle) - point[1] * math.sin(angle)
    y = point[0] * math.sin(angle) + point[1] * math.cos(angle)
    return [x, y, globalz]

angle = math.radians(10)
triangle = [[0.0, 0.0, globalz], [1.0, 0.0, globalz], rotate([1.0, 0.0], angle)  ]

triangles = []
triangles.append(triangle)

i=0
while(i<(360/math.degrees(angle))):
    triangle = triangles[-1].copy()
    triangle = [[0.0, 0.0, globalz], [triangle[2][0], triangle[2][1], globalz], rotate([triangle[2][0], triangle[2][1]], angle)]
    triangles.append(triangle)
    i+=1


triangles_bellow = copy.deepcopy(triangles)

for triangle in triangles_bellow:
    triangle[1] , triangle[2] = triangle[2], triangle[1]
    triangle[0][2] = -globalz
    triangle[1][2] = -globalz
    triangle[2][2] = -globalz


triangles.extend(triangles_bellow)

rectangles = []

for tt in triangles:
    for tb in triangles_bellow:
        t1 = [tt[1], tb[2], tb[1]]
        t2 = [tt[1], tb[1], tt[2]]
        rectangles.append(t1)
        rectangles.append(t2)

triangles.extend(rectangles)

print('{}\n\n'.format(len(triangles)*3))
for t in triangles:
    print('{} {} {}\n'.format(t[0][0], t[0][1], t[0][2]))
    print('{} {} {}\n'.format(t[1][0], t[1][1], t[1][2]))
    print('{} {} {}\n\n'.format(t[2][0], t[2][1], t[2][2]))


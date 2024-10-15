export default class Maths {
    // t% from a to b
    static Lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // Calculuate the distance from a line to a point
    static IsPointOnLine(startX, startY, endX, endY, pointX, pointY, lineWidth) {
        // Calculate the slope of the line
        const slope = (endY - startY) / (endX - startX);
      
        // Calculate the y-intercept of the line
        const yIntercept = startY - slope * startX;
      
        // Calculate the distance between the point and the line
        const distance = Math.abs(slope * pointX - pointY + yIntercept) / Math.sqrt(slope * slope + 1);
      
        // Check if the distance is within the line width
        return distance <= lineWidth / 2;
      }
}

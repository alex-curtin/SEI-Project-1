# SEI-Project-1
Name: Chord Frenzy

API: The project will use the Uberchord API to get notes for a particular chord or chords.

MVP:
1. Accept an input of chord root note and type
  - This is working but the types of chords are currently hard coded. I should be able to get a list of chord types from the API if I can get the API to return an array with more than 10 items.
  
2. Return chord data from uberchord API
  - This is currently working as it should.

3. Coerce chord data into data that can be used to create a chord chart
  - This is currently working as it should.

4. Create chord chart
  - It currently creates a chart that has starting fret info and fingering info, but doesn't have actual notes assigned to fret positions. To fix if possible, not high priority.

5. Display chord chart
  - The chart appears but I need to create conditions to alter the appearance based on the starting fret of the chart. 
  - Currently need to: fix appearance of muted strings on chords that start after fret; make finger notation markers appear over strings; Add fret markers; add conditions for barre chords.
  - The site needs to be styled & made responsive. This is the current priority.
  
6. Publish site on Surge

Strech: Stretch goals would include: displaying multiple variations for each chord, enabling users to save a list of chords they want to use, suggesting chords to go with the user's saved chords (this may require an additional API).

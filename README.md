# Back A Friend #

MongoDB version (to make two task results not quite identical - we went a bit different technical and logic ways)

## Installing / Getting started ##

To check the result you just need to run these two commands:

```git clone https://github.com/1webdev/back-friend-mongo.git . ```
```docker-compose up```

and then use http://localhost:3000 in your browser address bar.


## Testing ##

1. Add players using Add player button and fund them points (you can increase and decrease their points using Fund and Take buttons accordingly)
2. Announce the tournament with required deposit amount
3. Join the tournament:
* Players who have enough points to join the tournament have green Join button and can join it immediately
* Players who haven't enough points can click yellow Join button and system will recursively select possible backers and player automatically joins the tournament when required points are reached 
5. Start tournament to get random winner (balance is updated automatically)
6. You can also select required player from dropdown list to check his balance only.
7. You can revert all the changes clicking RESET DB button

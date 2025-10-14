@echo off
echo Checking PostgreSQL users...
echo.
psql -U postgres -c "\du"
echo.
echo.
echo If you see an error, try:
echo   psql -U Aleqo.4080 -c "\du"
echo.
pause


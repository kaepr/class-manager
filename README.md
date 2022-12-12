# Class Manager

Application built using React Remix for Coding Assignment.

## Tech Stack

- Remix: The Remix web framework was used. Remix is a new full stack javascript framework. It has several features which reduce the amount of boilerplate required when interacting with backends and thus used it in this project. The API functionality is built using Remix itself.
- Database: Postgres
- Docker: Docker is used for the container. Docker compose is used for ease of deployment.
- Prisma: Is an ORM for Node.js. Helps achieve end to end type safety across the project.

The project was scaffolded using [Remix blues stack](https://github.com/remix-run/blues-stack). This generates the boilerplate necessary for docker files, database deployment etc. This helped me focus on directly solving the problem.

## Schema

![ER Diagram](./schema.png)

## Screenshots

![Image 1](./img_1.png)
![Image 2](./img_2.png)
![Image 3](./img_3.png)

## Future Implementations

One of the possible scalable solutions can be using Postgres triggers and stored procedures. Currently there is a manual check performed whether we have already booked for that month or not, but we can automate this process.

We can allow the user to update their preferences for next month and store that in another column in the `Booking` table. Then we can create a procedure, which will run one month from a specified date. This procedure's responsibility is to update the table so that the preferences are set.

```sql
CREATE OR REPLACE FUNCTION update_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < CURRENT_DATE THEN
    NEW.batch = '...';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking
AFTER UPDATE ON booking
FOR EACH ROW
EXECUTE PROCEDURE update_booking();

```

Above is pseudocde for the same. Using the above methodology we can automate the batch updation process. We can also include checks with payment in the above code so that the user has paid before the procedure executes.

For checking payments, `cron` jobs can be set up. We can specify exactly when we want tasks to run. With this we can set up a procedure to run automatically after a month, so that the user's payment status will be changed to false.

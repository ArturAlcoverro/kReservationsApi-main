# [Back-end] kReservations

## Start

d

## Endpoints

- **GET** *`/reservation?after&before&email&phone`*
Request a list of reservations, optionally filtered.

    **Query parameters:**

  - `after` *UTC timestamp*
    The date after which to search for reservations
  - `before` *UTC timestamp*
    The date before which to search for reservations
  - `email` *string*
    An email to search for among reservations
  - `phone` *string*
    A phone number to search for among reservations

    **Response body:** An array of reservation objects

- **GET** *`/reservation/{id}`*
Request a specific reservation.

    **Path parameters:**

  - `id` *string*
    The unique identifier for the reservation

    **Response body:** A reservation object, if one exists

- **POST** `/reservation`
Create a new reservation.

    **Request body:** A reservation object that includes all information specified above that the restaurant needs.

    **Response body:** An object corresponding to the newly created reservation

- **PATCH** `/reservation/{id}`
Modify an existing reservation.

    **Path parameters:**

  - `id` *string*
    The unique identifier for the reservation

    **Request body:** A partial reservation object

    **Response body:** A complete, updated reservation object

- **DELETE** `/reservation/{id}`
Delete an existing reservation.

    **Path parameters:**

  - `id` *string*
    The unique identifier for the reservation
- **GET** *`/region`*
Request a list of all dining regions within the restaurant.

    **Response body:** An array of dining region objects

- **GET** *`/region/{id}`*
Request information about a dining region within the restaurant.

    **Path parameters:**

  - `id` *string*
    The unique identifier for a dining region

    **Response body:** An object representing the dining region

- **PATCH** `/region/{id}`
Modify a dining region.

    **Path parameters:**

  - `id` *string*
    The unique identifier for the dining region

    **Request body:** A partial dining region object

    **Response body:** A complete, updated dining region object

- **GET** *`/availability?after&before&num_slots`*
Request a list of open reservation slots, optionally filtered.

    **Query parameters:**

  - `after` *UTC timestamp*
    The date after which to search for open reservations slots
  - `before` *UTC timestamp*
    The date before which to search for open reservations slots
  - `num_slots` *number*
    The expected size of the list

    **Response body:** An array of objects that each contain a timestamp indicating the time of an open reservation slot and an identifier for the available dining region.

## Database

To perform this test, the following changes have been made to the database:

---
- **regions** table added the database with the following fields

    - `region_id` *uuid*
    - `name` *text*
    - `for_children` *boolean*
    - `for_smokers` *boolean*
---
- **tables** table added the database with the following fields

    - `table_id` *uuid*
    - `region_id` *uuid*
    - `capacity` *integer*

---
- **tables** table added the database with the following fields

    - `reservation_id` *uuid*
    - `table_id` *uuid*
    - `reservation_date` *timestamptz*

---
- **reservations** modified to have the `email` field


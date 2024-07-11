import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class task {
    private static final int GARAGE_CAPACITY = 10;
    private static final int STREET_CAPACITY = 8;

    private LinkedList<String> aGarage;
    private LinkedList<String> bGarage;
    private Queue<String> streetQueue;

    public task() {
        aGarage = new LinkedList<>();
        bGarage = new LinkedList<>();
        streetQueue = new LinkedList<>();
    }

    public static void main(String[] args) {
        task system = new task();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("Enter command (a <license> for arrival, d <license> for departure, q to quit):");
            String input = scanner.nextLine();
            if (input.equals("q")) {
                break;
            }

            String[] parts = input.split(" ");
            if (parts.length != 2) {
                System.out.println("Invalid input. Please enter a valid command.");
                continue;
            }

            String command = parts[0];
            String licensePlate = parts[1];

            if (command.equals("a")) {
                system.arrive(licensePlate);
            } else if (command.equals("d")) {
                system.depart(licensePlate);
            } else {
                System.out.println("Invalid command. Please enter 'a' for arrival or 'd' for departure.");
            }
        }

        scanner.close();
    }

    public void arrive(String licensePlate) {
        if (aGarage.size() < GARAGE_CAPACITY) {
            aGarage.add(licensePlate);
            System.out.println("Car " + licensePlate + " arrived at A Garage.");
        } else if (bGarage.size() < GARAGE_CAPACITY) {
            bGarage.add(licensePlate);
            System.out.println("Car " + licensePlate + " arrived at B Garage.");
        } else if (streetQueue.size() < STREET_CAPACITY) {
            streetQueue.add(licensePlate);
            System.out.println("Car " + licensePlate + " is waiting in the street.");
        } else {
            System.out.println("Car " + licensePlate + " redirected to Hitech City.");
        }
    }

    public void depart(String licensePlate) {
        if (aGarage.contains(licensePlate)) {
            int fee = calculateFee(aGarage.indexOf(licensePlate));
            aGarage.remove(licensePlate);
            System.out.println("Car " + licensePlate + " departed from A Garage. Fee: $" + fee);
        } else if (bGarage.contains(licensePlate)) {
            int fee = calculateFee(bGarage.indexOf(licensePlate));
            bGarage.remove(licensePlate);
            System.out.println("Car " + licensePlate + " departed from B Garage. Fee: $" + fee);
        } else if (streetQueue.contains(licensePlate)) {
            streetQueue.remove(licensePlate);
            System.out.println("Car " + licensePlate + " departed from the street.");
        } else {
            System.out.println("Car " + licensePlate + " not found.");
        }
        moveCarFromStreet();
    }

    private int calculateFee(int position) {
        if (position == 0) {
            return 10;
        } else if (position == 1) {
            return 20;
        } else {
            return 25;
        }
    }

    private void moveCarFromStreet() {
        if (!streetQueue.isEmpty()) {
            String nextCar = streetQueue.poll();
            if (aGarage.size() < GARAGE_CAPACITY) {
                aGarage.add(nextCar);
                System.out.println("Car " + nextCar + " moved from the street to A Garage.");
            } else if (bGarage.size() < GARAGE_CAPACITY) {
                bGarage.add(nextCar);
                System.out.println("Car " + nextCar + " moved from the street to B Garage.");
            }
        }
    }
}

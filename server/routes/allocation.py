students = [
    {
        "id": 1,
        "name": "Student 1",
        "cpi": 7.8,
        "selected_elective": [
            {"code": "HS308", "name": "Entrepreneurship: Theory and Practice"},
            {"code": "CS332", "Project": "Project 3"},
        ],
    },
    {
        "id": 2,
        "name": "Student 2",
        "cpi": 8.5,
        "selected_elective": [
            {"code": "HS307", "name": "Advanced Communication Skills"},
            {"code": "Project", "name": "Project 2"},
        ],
    },
]

electives = [
    [
        {"code": "HS307", "name": "Advanced Communication Skills"},
        {"code": "HS308", "name": "Entrepreneurship: Theory and Practice"},
    ],
    [
        {"code": "CS653", "name": "Approximation Algorithm"},
        {"code": "CS332", "name": "Storage Systems"},
        {"code": "Project", "name": "Project 1"},
        {"code": "Project", "name": "Project 2"},
        {"code": "Project", "name": "Project 3"},
    ],
]

max_capacity = {
    "HS307: Advanced Communication Skills": 1,
    "HS308: Entrepreneurship: Theory and Practice": 1,
    "CS653: Approximation Algorithm": 2,
    "CS332: Storage Systems": 1,
    "Project: Project 1": 3,
    "Project: Project 2": 0,
    "Project: Project 3": 2,
}

option1 = electives[0]
print("electives: ", option1)
print("\n")
allocated_students = {
    f"{elective['code']}: {elective['name']}": [] for elective in option1
}
print("allocated_students: ", allocated_students)
print("\n")
sorted_students = sorted(students, key=lambda x: x["cpi"], reverse=True)
print(sorted_students)


def allocate_electives(students, electives):
    allocated_students = {f"{elective['code']}: {elective['name']}": [] for elective in electives}

    # Sort students by CPI in descending order
    sorted_students = sorted(students, key=lambda x: x["cpi"], reverse=True)

    for student in sorted_students:
        preferred_choices = student["selected_elective"]
        for choice in preferred_choices:
            choice_desc = f"{choice['code']}: {choice['name']}"
            for elective in electives:
                elective_desc = f"{elective['code']}: {elective['name']}"
                if elective_desc == choice_desc:
                    if len(allocated_students[choice_desc]) < max_capacity[choice_desc]:
                        allocated_students[choice_desc].append(student)
                        break
            else:
                continue  # If the elective is full, move to the next choice
            break  # If allocation is successful, move to the next student

    return allocated_students

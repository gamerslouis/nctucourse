import json
from simulation.models import SemesterCoursesMapping, SimCollect
from django.db import transaction
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Update semester mapping"

    def add_arguments(self, parser):
        parser.add_argument("input", help="input crawler file")
        parser.add_argument("-f", "--force", action="store_true", help="force update database")

    def handle(self, *args, **options):
        print(options)
        with open(options["input"]) as f:
            data = json.load(f)
            semester = data['semester']
            semesterDataFile = data['semesterDataFile']
            courseIds = data['courseIds']

        with transaction.atomic():
            obj, created = SemesterCoursesMapping.objects.get_or_create(
                semester=semester, defaults={'file': semesterDataFile}
            )
            if not created:
                obj.file = semesterDataFile
                obj.save()

            ids = set(
                SimCollect.objects.filter(semester=semester).values_list('course_id',
                                                                         flat=True).distinct()
            )
            dids = set(courseIds)
            deletedIds = ids.difference(dids)
            if len(deletedIds) > 0:
                if len(deletedIds) > 20 and not options["force"]:
                    raise CommandError(
                        f"Abort: delete too many courses ({len(deletedIds)}), please use -f"
                    )
                else:
                    SimCollect.objects.filter(semester=semester, course_id__in=deletedIds).delete()
                    print("delete courses: " + str(deletedIds))
            else:
                print("no course deleted")

# Dataset

[tips.csv](tips.csv) is the public reshape2 Tips dataset from [Rdatasets](https://vincentarelbundock.github.io/Rdatasets/doc/reshape2/tips.html). The [source CSV](https://raw.githubusercontent.com/vincentarelbundock/Rdatasets/master/csv/reshape2/tips.csv) was copied without editing.

The original course CSV was unavailable. The public file matches the recorded schema, row count, group counts and duplicate-row count. The original source file could not be compared byte for byte.

| Field | Meaning |
| --- | --- |
| rownames | Record identifier |
| total_bill | Bill amount in dollars |
| tip | Tip amount in dollars |
| sex | Recorded category |
| smoker | Recorded smoking status |
| day | Day of the week |
| time | Lunch or dinner |
| size | Party size |

The notebook derives tip rate as 100 × tip / total_bill. It retains both observations from the one pair that shares the same measured values.

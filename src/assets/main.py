with open('basefeatures.tsv', 'r') as file:
    data = [line.rstrip().split('\t') for line in file.readlines()]
    data = [[line[0]] + line[2:] for line in data]
    data = ['\t'.join(line).replace('+', 'true').replace('-', 'false')
            for line in data]
    with open('result.tsv', 'w') as ofile:
        for line in data:
            ofile.write(line)
            ofile.write('\n')
